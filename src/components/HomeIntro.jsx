import { profile } from '../data/siteData';
import CopyEmailButton from './CopyEmailButton';

const HomeIntro = () => (
    <section className="home-intro" aria-labelledby="home-title">
        <p className="eyebrow">{profile.eyebrow}</p>
        <h1 id="home-title">
            {profile.headlineStart}{' '}
            <strong>{profile.headlineStrong}</strong>{' '}
            {profile.headlineEnd}
        </h1>
        <div className="intro-copy">
            <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer
                vitae sem at ipsum placerat luctus. <CopyEmailButton />
            </p>
        </div>
    </section>
);

export default HomeIntro;
