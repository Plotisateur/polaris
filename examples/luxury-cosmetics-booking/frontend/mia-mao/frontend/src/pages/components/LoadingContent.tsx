import Loader from '../../shared-components/Loader';
import PageLayout from './Layout/PageLayout';

export default function LoadingContent({ title }: { title: string }) {
  return (
    <PageLayout
      headerProps={{
        title,
      }}
    >
      <Loader />
    </PageLayout>
  );
}
