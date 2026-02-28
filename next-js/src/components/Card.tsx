import { Card, Space } from "antd";
import { ReactNode } from "react";

interface Props {
  heading?: ReactNode;
  className?: string;
  children?: React.ReactNode;
}

const CardComponent = ({ heading, className, children }: Props) => (
  <Space vertical size={16}>
    <Card title={heading || ""} style={{ width: 500 }} className={className}>
      {children}
    </Card>
  </Space>
);

export default CardComponent;
