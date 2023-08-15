import { Link as ReactLink } from "react-router-dom";

import { Heading, Link, Text } from "@chakra-ui/react";

const NotFoundPage: React.FC = () => {
  return (
    <>
      <Heading as="h2">お探しのフォントは見つかりませんでした</Heading>
      <Text mt={5}>
        <Link as={ReactLink} to="/">
          トップページ
        </Link>
        から再度検索してください。
      </Text>
    </>
  );
};

export default NotFoundPage;
