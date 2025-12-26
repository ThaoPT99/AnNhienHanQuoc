import { useLocation } from 'react-router-dom';
import SimpleChatbot from './SimpleChatbot';
import ConsultationButton from './ConsultationButton';
import ExitIntentPopup from './ExitIntentPopup';
import SocialProof from './SocialProof';
import LiveChat from './LiveChat';

// Components that should be hidden on Community page
const ConditionalComponents = () => {
  const location = useLocation();
  const isCommunityPage = location.pathname === '/community' || location.pathname.startsWith('/community/');

  if (isCommunityPage) {
    return null; // Don't render these components on Community page
  }

  return (
    <>
      <SimpleChatbot />
      <ConsultationButton />
      <ExitIntentPopup />
      <SocialProof />
      <LiveChat />
    </>
  );
};

export default ConditionalComponents;
