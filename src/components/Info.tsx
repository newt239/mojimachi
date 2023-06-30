import { useEffect, useState } from "react";

import { Table, TableContainer, Tbody, Td, Th, Tr } from "@chakra-ui/react";
import { invoke } from "@tauri-apps/api";

import { fontNameTableIds } from "~/utils/font";

type FontInfoProps = {
  font_name: string;
};

const Info: React.FC<FontInfoProps> = ({ font_name }) => {
  const [headData, setHeadData] = useState<string[]>([]);

  const getFontHead = async (font_name: string) => {
    const fontHead: string[] = await invoke("get_font_head", {
      name: font_name,
    });
    console.log(fontHead);
    setHeadData(fontHead);
  };

  useEffect(() => {
    if (font_name) {
      getFontHead(font_name);
    }
  }, []);

  return (
    <TableContainer>
      <Table variant="simple">
        <Tbody>
          {headData.map((value, i) => (
            <Tr key={fontNameTableIds[i]}>
              <Th maxW="150px">{fontNameTableIds[i]}</Th>
              <Td>{value}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
};

export default Info;
