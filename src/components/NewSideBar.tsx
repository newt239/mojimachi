import { Link, useNavigate } from "react-router-dom";

import { Navbar, SegmentedControl, Text, Textarea, Title } from "@mantine/core";

export function NewSideBar() {
  const navigate = useNavigate();
  return (
    <Navbar height={700} width={{ sm: 300 }} p="md">
      <Navbar.Section mb="md">
        <Link to="/">
          <Title
            color="yellow"
            order={1}
            sx={{
              lineHeight: 1,
              transition: "color 0.2s ease",
              ":hover": {
                color: "black",
              },
            }}
          >
            Local Font Emulator
          </Title>
        </Link>
      </Navbar.Section>

      <Textarea placeholder="Type something..." size="xs" mb="sm" />

      <Navbar.Section>
        <Text size="xs" weight={500} color="dimmed" mb="xs">
          フィルター
        </Text>
        <SegmentedControl
          data={[
            { value: "all", label: "すべて" },
            { value: "pinned", label: "お気に入り" },
          ]}
          onChange={(value) => {
            if (value === "all") {
              navigate("/");
            } else if (value === "pinned") {
              navigate("/?pinned=true");
            }
          }}
          fullWidth
        />
      </Navbar.Section>
    </Navbar>
  );
}
