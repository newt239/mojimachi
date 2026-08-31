import { useEffect, useState } from "react";

import { Table, TableContainer, Tbody, Td, Th, Tr } from "@chakra-ui/react";
import { invoke } from "@tauri-apps/api/core";

import { fontNameTableIds } from "#/utils/font";

type FontInfoProps = {
  font_name: string;
};

export const Info: React.FC<FontInfoProps> = ({ font_name }) => {
  const [headData, setHeadData] = useState<string[]>([]);

  useEffect(() => {
    let cancelled = false;

    const getFontHead = async () => {
      const fontHead: string[] = await invoke("get_font_head", {
        name: font_name,
      });
      if (!cancelled) {
        setHeadData(fontHead);
      }
    };

    void getFontHead();

    return () => {
      cancelled = true;
    };
  }, [font_name]);

  return (
    <TableContainer>
      <Table variant="simple">
        <Tbody>
          {headData.map((value, i) => (
            <Tr key={fontNameTableIds[i]}>
              <Th maxW="250px">{fontNameTableIds[i]}</Th>
              <Td>{value}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
};
