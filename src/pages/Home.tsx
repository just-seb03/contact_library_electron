import { Page } from 'framework7-react';
import { HomeHeader } from '../components/Home/HomeHeader';

export default function Home() {
  return (
    <Page className="display-flex flex-direction-column align-items-center">
      <HomeHeader />
    </Page>
  );
}
