<script lang="ts">
  import { getLocalization } from '$lib/i18n';
  import { onMount } from 'svelte';
  import QrScanner from 'qr-scanner';
  const {t} = getLocalization();

  let qrEnableElem: HTMLDivElement;
  let qrScannedElem: HTMLDivElement;
  let qrReaderSourceElem: HTMLVideoElement;
  let showScannedInfo: boolean = false;
  let qrScannerEnabled: boolean = false;
  let cameraUnavailable: boolean = false;

  onMount(async () => {
    async function enableQrClickHandler() {
      qrEnableElem.classList.add('disabled');

      if (await QrScanner.hasCamera()) {
        let removeScannedClassDeBouncer;
        let loginToken: string;
        const qrScanner = new QrScanner(
          qrReaderSourceElem,
          (result) => {
            if (result.data === loginToken) {
              return;
            }

            loginToken = result.data;

            showScannedInfo = true;
            // Update de-bouncer for reducing updates
            clearTimeout(removeScannedClassDeBouncer);
            removeScannedClassDeBouncer = setTimeout(() => {
              showScannedInfo = false;
            }, 1000); // Timeout amount is the de-bouncer

            console.log('Try login with token:', loginToken);
          },
          {
            returnDetailedScanResult: true,
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

    qrEnableElem.addEventListener('click', enableQrClickHandler);

    return () => {
      qrEnableElem.removeEventListener('click', enableQrClickHandler);

      if (qrScanner) {
        qrScanner.destroy();
        qrScanner = null;
      }
    }
  });
</script>

<div class="md:container md:mx-auto px-4">
  <p>Some text here</p>

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
      <div bind:this={qrScannedElem} class="absolute inset-0 flex justify-center items-center text-white text-xl font-bold z-10 bg-green-600/50 opacity-0 transition-opacity motion-reduce:transition-none {showScannedInfo ? '!opacity-100' : ''}">{$t('QR Code gescannt')}</div>
      <video bind:this={qrReaderSourceElem} class="!w-full {qrScannerEnabled && !cameraUnavailable ? 'block' : 'hidden'}"></video>
    </div>
  </div>

  <p>Some text here</p>
</div>
