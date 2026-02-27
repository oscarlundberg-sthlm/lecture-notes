import { useDataContext } from "@/contexts/Data";
import { ClockCircleOutlined, WarningOutlined } from "@ant-design/icons";
import classNames from "classnames";

interface Props {
  className?: string;
}

const Banner = (props: Props) => {
  const { lastSavedAtTimestamp, currentFilepath, pdf } = useDataContext();

  if (!currentFilepath && pdf?.base64) {
    return (
      <BannerScalfold style="red">
        <WarningOutlined className="pr-2" />
        <div>Unsaved</div>
      </BannerScalfold>
    );
  }

  if (lastSavedAtTimestamp) {
    return (
      <BannerScalfold>
        <ClockCircleOutlined className="pr-2" />
        <div>
          last saved at {new Date(lastSavedAtTimestamp).toLocaleTimeString()}
        </div>
      </BannerScalfold>
    );
  }

  return <></>;
};

export default Banner;

const BannerScalfold = ({
  children,
  className,
  style,
}: {
  children: React.ReactNode;
  className?: string;
  style?: "red";
}) => {
  return (
    <div
      className={classNames(
        {
          "z-40 fixed top-0 max-w-max border-b border-r rounded-br-lg border-gray-300 shadow-md": true,
          "bg-red-800": style === "red",
          "bg-white": !style,
        },
        className,
      )}
    >
      <div className="my-1 mx-2">
        <div
          className={classNames({
            "flex items-center text-xs ": true,
            "text-red-100": style === "red",
            "text-gray-500": !style,
          })}
        >
          {children}
        </div>
      </div>
    </div>
  );
};
