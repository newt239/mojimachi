import { useState } from "react";

import { Box, ColorInput, Flex, NumberInput, Paper } from "@mantine/core";

import { useAtomValue } from "jotai";

import { textAtom } from "~/jotai/atoms";

const Lab: React.FC<{ fontFamily: string }> = ({ fontFamily }) => {
  const text = useAtomValue(textAtom);
  const [fontSize, setFontSize] = useState(16);
  const [lineHeight, setLineHeight] = useState(1);
  const [color, setColor] = useState("hsla(0, 0%, 0%, 1)");
  const [backgroundColor, setBackgroundColor] = useState(
    "hsla(0, 0%, 100%, 1)"
  );

  return (
    <Flex w="100%" justify="space-between">
      <Box
        mx="md"
        p="md"
        w="70%"
        style={{
          fontFamily,
          fontSize,
          lineHeight,
          color,
          backgroundColor,
        }}
      >
        {text}
      </Box>
      <Paper w="30%" shadow="xs" p="md">
        <NumberInput
          defaultValue={fontSize}
          label="文字サイズ"
          onChange={(n) => n && setFontSize(n)}
        />
        <NumberInput
          defaultValue={lineHeight}
          label="行間"
          step={0.1}
          precision={2}
          onChange={(n) => n && setLineHeight(n)}
        />
        <ColorInput
          defaultValue={color}
          label="文字色"
          format="hsla"
          onChange={setColor}
        />
        <ColorInput
          defaultValue={backgroundColor}
          label="背景色"
          format="hsla"
          onChange={setBackgroundColor}
        />
      </Paper>
    </Flex>
  );
};

export default Lab;
