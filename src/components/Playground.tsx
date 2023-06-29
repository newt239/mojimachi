import { useState } from "react";

import {
  Box,
  Card,
  Flex,
  FormControl,
  FormLabel,
  Input,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
} from "@chakra-ui/react";

type PlaygroundProps = {
  font_name: string;
};

const Playground: React.FC<PlaygroundProps> = ({ font_name }) => {
  const [text, setText] = useState("あいうえお");
  const [fontSize, setFontSize] = useState("16");
  const [lineHeight, setLineHeight] = useState("1");
  const [color, setColor] = useState("hsla(0, 0%, 0%, 1)");
  const [backgroundColor, setBackgroundColor] = useState(
    "hsla(0, 0%, 100%, 1)"
  );

  return (
    <Flex w="100%" justify="space-between" gap={3}>
      <Box
        mx="md"
        p="md"
        w="70%"
        sx={{
          fontFamily: `'${font_name}', Tofu`,
          fontSize,
          lineHeight,
          color,
          backgroundColor,
        }}
      >
        {text}
      </Box>
      <Card w="30%" shadow="xs" p={3}>
        <FormControl>
          <FormLabel>文字</FormLabel>
          <Input value={text} onChange={(n) => setText(n.target.value)} />
        </FormControl>
        <FormControl>
          <FormLabel>文字サイズ</FormLabel>
          <NumberInput
            defaultValue={fontSize}
            onChange={(n) => n && setFontSize(n)}
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </FormControl>
        <FormControl>
          <FormLabel>行間</FormLabel>
          <NumberInput
            defaultValue={lineHeight}
            step={0.1}
            precision={2}
            onChange={(n) => n && setLineHeight(n)}
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </FormControl>
        <FormControl>
          <FormLabel>文字色</FormLabel>
          <input
            type="color"
            defaultValue={color}
            onChange={(e) => setColor(e.target.value)}
          />
        </FormControl>
        <FormControl>
          <FormLabel>背景色</FormLabel>
          <input
            type="color"
            defaultValue={backgroundColor}
            onChange={(e) => setBackgroundColor(e.target.value)}
          />
        </FormControl>
      </Card>
    </Flex>
  );
};

export default Playground;
