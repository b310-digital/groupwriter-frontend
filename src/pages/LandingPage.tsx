import { createDocument } from '../utils/serverRequests';
import { Link, useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import './landingPageStyles.scss';
import { getLocalMostRecentThreeDocuments } from '../utils/localstorage';

function LandingPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const sortedDocuments = getLocalMostRecentThreeDocuments();

  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen background">
      <div className="flex flex-col items-center bg-white rounded-lg p-4 w-80 h-96 lg:w-96 landing-box">
        <h1 className="text-4xl font-bold text-center mt-8 mb-4 text-neutral-700">
          {t('page.landing.title')}
        </h1>
        <span className="text-center text-neutral-700 mb-4">
          {t('page.landing.description')}
        </span>

        <button
          type="submit"
          onClick={() => {
            void (async () => {
              const link = await createDocument();
              if (link) await navigate(link);
            })();
          }}
        >
          {t('page.landing.buttons.new')}
        </button>

        <div className="text-neutral-700 mt-4 ">
          {t('page.landing.recentTexts.title')}
        </div>
        <ul className="list-none text-secondary">
          {Object.values(sortedDocuments).map((document) => (
            <li key={document.id} className="text-sm">
              <Link
                to={{
                  pathname: `/document/${document.id}`,
                  hash: document.modificationSecret
                }}
              >
                {document?.createdAt && (
                  <span>
                    {t('page.landing.recentTexts.item')}{' '}
                    {new Date(document?.createdAt).toLocaleString()}
                  </span>
                )}
              </Link>
            </li>
          ))}
          {Object.values(sortedDocuments).length === 0 && (
            <li className="text-sm">-</li>
          )}
        </ul>

        <div className="flex flex-row items-center mt-auto">
          <ul className="flex flex-row gap-x-4 mt-4">
            <li>
              <a href="https://github.com/b310-digital/groupwriter/">
                {t('modals.about.linkSourceCode')}
              </a>
            </li>
            {import.meta.env.VITE_PRIVACY_STATEMENT_URL && (
              <li>
                <a href={import.meta.env.VITE_PRIVACY_STATEMENT_URL}>
                  {t('modals.about.linkPrivacy')}
                </a>
              </li>
            )}
            {import.meta.env.VITE_LEGAL_URL && (
              <li>
                <a href={import.meta.env.VITE_LEGAL_URL}>
                  {t('modals.about.linkLegal')}
                </a>
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
