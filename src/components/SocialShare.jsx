import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  LinkedinShareButton,
  EmailShareButton,
  FacebookIcon,
  TwitterIcon,
  WhatsappIcon,
  LinkedinIcon,
  EmailIcon,
} from "react-share";

const SocialShare = ({ bookTitle, bookUrl }) => {
  const shareTitle = `Check out this book: ${bookTitle}`;
  const iconSize = 32;

  return (
    <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
      <h4 className="text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
        Share this book:
      </h4>
      <div className="flex space-x-2">
        <TwitterShareButton url={bookUrl} title={shareTitle}>
          <TwitterIcon size={iconSize} round />
        </TwitterShareButton>

        <FacebookShareButton url={bookUrl} quote={shareTitle}>
          <FacebookIcon size={iconSize} round />
        </FacebookShareButton>

        <WhatsappShareButton url={bookUrl} title={shareTitle} separator=":: ">
          <WhatsappIcon size={iconSize} round />
        </WhatsappShareButton>

        <LinkedinShareButton
          url={bookUrl}
          title={bookTitle}
          summary="Found this interesting book..."
        >
          <LinkedinIcon size={iconSize} round />
        </LinkedinShareButton>

        <EmailShareButton
          url={bookUrl}
          subject={shareTitle}
          body="Hi, I thought you might find this book interesting:"
        >
          <EmailIcon size={iconSize} round />
        </EmailShareButton>
      </div>
    </div>
  );
};

export default SocialShare;
