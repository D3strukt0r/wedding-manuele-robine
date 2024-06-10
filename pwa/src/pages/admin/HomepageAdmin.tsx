import useDashboard from '#/api/admin/dashboard/useDashboard.ts';
import ListCard from '#/components/common/ListCard.tsx';
import { useTranslation } from 'react-i18next';

export default function HomepageAdmin() {
  const { t } = useTranslation('app');
  const dashboardInfo = useDashboard();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <h2 className="text-lg font-semibold mb-2">{t('dashboard.food.title')}</h2>
        <ListCard items={Object.entries(dashboardInfo.data?.foodChoices ?? {}).map(([food, count]) => ({
          id: food,
          content: t('dashboard.food.line', {
            food: t(food === 'not_decided' ? 'dashboard.food.notDecided': `enum.food.${food}`),
            count,
          }),
        }))} />
      </div>
      <div>
        <h2 className="text-lg font-semibold mb-2">{t('dashboard.allergies.title')}</h2>
        <ListCard items={dashboardInfo.data?.allergies.map((allergy) => ({
          id: allergy.inviteeId,
          content: t('dashboard.allergies.line', {
            name: allergy.name,
            allergies: allergy.allergies,
          }),
        })) ?? []} />
      </div>
    </div>
  );
}
