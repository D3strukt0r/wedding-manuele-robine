<script lang="ts">
  import { getLocalization } from '$lib/i18n';
  import { onMount } from 'svelte';
  import QrScanner from 'qr-scanner';
  import {api} from '$lib/api';
  import {localStorageStore} from '$lib/localstorage-store';
  import axios from 'axios';
  import {goto} from '$app/navigation';
  const {t} = getLocalization();

  // https://stackoverflow.com/a/43467144/4156752
  function isValidHttpUrl(string: string) {
    let url;

    try {
      url = new URL(string);
    } catch (_) {
      return false;
    }

    return url.protocol === "http:" || url.protocol === "https:";
  }

  let qrEnableElem: HTMLDivElement;
  let qrReaderSourceElem: HTMLVideoElement;
  let showScannedInfoSuccess: boolean = false;
  let showScannedInfoError: boolean = false;
  let qrScannerEnabled: boolean = false;
  let scanInProgress: boolean = false;
  let cameraUnavailable: boolean = false;

  const auth = localStorageStore('auth', {jwt: null});
  auth.subscribe((value) => {
    axios.defaults.headers.common['Authorization'] = `Bearer ${value.jwt}`;
  });
  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response.status === 401) {
        auth.set({jwt: null});
      }

      return Promise.reject(error);
    },
  );

  onMount(async () => {
    const urlParam = new URLSearchParams(window.location.search);
    const username = urlParam.get('username');
    const password = urlParam.get('password');
    if (username && password) {
      try {
        const response = await api.common.login({ username, password });
        auth.set({jwt: response.token});
        await goto('/');
      } catch (e) {
        // Ignore
      }
    }

    async function enableQrClickHandler() {
      qrEnableElem.classList.add('disabled');

      if (await QrScanner.hasCamera()) {
        let removeScannedClassDeBouncer;
        const qrScanner = new QrScanner(
          qrReaderSourceElem,
          async (result) => {
            if (scanInProgress) {
              return;
            }
            scanInProgress = true;

            // Reset before clearing timeouts (stuck in animation otherwise)
            showScannedInfoSuccess = false;
            showScannedInfoError = false;

            if (!isValidHttpUrl(result.data)) {
              showScannedInfoError = true;
              // Update de-bouncer for reducing updates
              clearTimeout(removeScannedClassDeBouncer);
              removeScannedClassDeBouncer = setTimeout(() => {
                showScannedInfoError = false;
              }, 1000); // Timeout amount is the de-bouncer
              scanInProgress = false;
              return;
            }

            const url = new URL(result.data);
            const username = url.searchParams.get('username');
            const password = url.searchParams.get('password');

            showScannedInfoSuccess = true;
            // Update de-bouncer for reducing updates
            clearTimeout(removeScannedClassDeBouncer);
            removeScannedClassDeBouncer = setTimeout(() => {
              showScannedInfoSuccess = false;
            }, 1000); // Timeout amount is the de-bouncer

            try {
              const response = await api.common.login({ username, password });
              auth.set({jwt: response.token});
              qrEnableElem.removeEventListener('click', enableQrClickHandler);
            } finally {
              scanInProgress = false;
            }
          },
          {
            returnDetailedScanResult: true,
            highlightScanRegion: true,
            maxScansPerSecond: 2,
          },
        );
        await qrScanner.setCamera('environment');

        qrScannerEnabled = true;
        await qrScanner.start();
      } else {
        cameraUnavailable = true;
      }
    }

    if (qrEnableElem) {
      qrEnableElem.addEventListener('click', enableQrClickHandler);
    }

    return () => {
      if (qrEnableElem) {
        qrEnableElem.removeEventListener('click', enableQrClickHandler);
      }

      if (qrScanner) {
        qrScanner.destroy();
        qrScanner = null;
      }
    }
  });
</script>

<div class="md:container md:mx-auto px-4">
  <p>Some text here</p>

  {#if $auth.jwt}
    <p>Logged in</p>
  {:else}
    <!-- Login with QR Code (Login Token) -->
    <div class="my-8 border-2 border-gray-300 bg-gray-200 max-w-screen-md mx-auto">
      <div bind:this={qrEnableElem} class="text-center p-8 {qrScannerEnabled ? 'hidden' : ''}">
        <div class="text-center mb-4">
          <svg class="inline mb-8 mt-4" xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="currentColor" viewBox="0 0 16 16">
            <path d="M0 .5A.5.5 0 0 1 .5 0h3a.5.5 0 0 1 0 1H1v2.5a.5.5 0 0 1-1 0v-3Zm12 0a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-1 0V1h-2.5a.5.5 0 0 1-.5-.5ZM.5 12a.5.5 0 0 1 .5.5V15h2.5a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5v-3a.5.5 0 0 1 .5-.5Zm15 0a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1 0-1H15v-2.5a.5.5 0 0 1 .5-.5ZM4 4h1v1H4V4Z"/>
            <path d="M7 2H2v5h5V2ZM3 3h3v3H3V3Zm2 8H4v1h1v-1Z"/>
            <path d="M7 9H2v5h5V9Zm-4 1h3v3H3v-3Zm8-6h1v1h-1V4Z"/>
            <path d="M9 2h5v5H9V2Zm1 1v3h3V3h-3ZM8 8v2h1v1H8v1h2v-2h1v2h1v-1h2v-1h-3V8H8Zm2 2H9V9h1v1Zm4 2h-1v1h-2v1h3v-2Zm-4 2v-1H8v1h2Z"/>
            <path d="M12 9h2V8h-2v1Z"/>
          </svg>
        </div>
        <button type="button" class="bg-green-600 px-3.5 py-2.5 font-semibold text-white hover:bg-green-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600">{$t('Kamera aktivieren!')}</button>
      </div>
      <div class="relative">
        <div class="absolute inset-0 flex justify-center items-center text-white text-xl font-bold z-10 bg-green-600/50 opacity-0 transition-opacity motion-reduce:transition-none {showScannedInfoSuccess ? '!opacity-100' : ''}">{$t('QR Code gescannt, Login im gange ...')}</div>
        <div class="absolute inset-0 flex justify-center items-center text-white text-xl font-bold z-10 bg-red-600/50 opacity-0 transition-opacity motion-reduce:transition-none {showScannedInfoError ? '!opacity-100' : ''}">{$t('Der QR Code ist ungültig')}</div>
        <video bind:this={qrReaderSourceElem} class="!w-full {qrScannerEnabled && !cameraUnavailable ? 'block' : 'hidden'}"></video>
      </div>
    </div>
  {/if}

  <p>Some text here</p>
</div>
