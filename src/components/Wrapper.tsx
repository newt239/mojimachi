import { Route, Routes } from "react-router-dom";

import { Anchor, Box, Flex, Text } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";

import { NewSideBar } from "./NewSideBar";

import FontPage from "~/pages/Font";
import HomePage from "~/pages/Home";

const Wrapper = () => {
  const matches = useMediaQuery("(min-width: 30em)");
  return (
    <>
      {matches ? (
        <Flex>
          <NewSideBar />
          <Box w="100%" p="md">
            <Routes>
              <Route path="/">
                <Route index element={<HomePage />} />
                <Route path="font">
                  <Route path=":fontFamily" element={<FontPage />} />
                </Route>
                <Route path="*" element={<HomePage />} />
              </Route>
            </Routes>
          </Box>
        </Flex>
      ) : (
        <Box p="md">
          <Text>
            本アプリケーションはデスクトップのブラウザでのみ動作します。対応ブラウザの詳細は
            <Anchor
              href="https://caniuse.com/mdn-api_window_querylocalfonts"
              target="_blank"
            >
              Window API: queryLocalFonts | Can I use
            </Anchor>
            をご確認ください。
          </Text>
        </Box>
      )}
    </>
  );
};

export default Wrapper;
