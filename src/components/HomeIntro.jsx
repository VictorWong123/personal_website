import { profile } from '../data/siteData';
import CopyEmailButton from './CopyEmailButton';

const contactPrompt = 'If interested in working together, reach out.';

const HomeIntro = () => (
    <section className="home-intro" aria-labelledby="home-title">
        <p className="eyebrow">{profile.eyebrow}</p>
        <h1 id="home-title">{profile.headline}</h1>
        
        <div className="intro-copy">
            <p>
                {profile.intro.replace(contactPrompt, '').trim()}
                <p> {profile.note}</p>

                <br />
                If interested in working together,{' '}
                <CopyEmailButton className="inline-copy-button" label="reach out." />
            </p>
        </div>
    </section>
);

export default HomeIntro;
