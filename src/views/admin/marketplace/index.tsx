import React from "react";
// Chakra imports
import {
  Box,
  Button,
  Flex,
  Grid,
  useColorModeValue,
  Input,
  Textarea,
  Spinner,
} from "@chakra-ui/react";
import Banner from "../profile/components/Storage";
import Card from "components/card/Card";
import { useDispatch, useSelector } from "store";
import { sendNotificationThunk } from "store/actions/userActions";
export type ServerResponse = {
  ok: boolean;
  success_count: number;
  failure_count: number;
};
export default function Marketplace() {
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [data, setData] = React.useState<ServerResponse | null>();
  const { loading } = useSelector((state) => state.user);
  const brandColor = useColorModeValue("brand.500", "white");
  // Chakra Color Mode
  const dispatch = useDispatch();
  const textColor = useColorModeValue("secondaryGray.900", "white");
  const textColorBrand = useColorModeValue("brand.500", "white");
  return (
    <Box pt={{ base: "180px", md: "80px", xl: "80px" }}>
      {/* Main Fields */}
      <Grid
        mb="20px"
        gridTemplateColumns={{ xl: "repeat(3, 1fr)", "2xl": "1fr 0.46fr" }}
        gap={{ base: "20px", xl: "20px" }}
        display={{ base: "block", xl: "grid" }}
      >
        <Card
          alignItems="center"
          mb={{ base: "0px", lg: "20px" }}
          style={{ padding: 20, borderRadius: 10 }}
        >
          <Input
            placeholder="Notification Title"
            style={{
              border: "2px solid blue",
              marginBottom: 10,
            }}
            size="lg"
            value={title}
            colorScheme={brandColor}
            onChange={(event: any) => setTitle(event.target.value)}
          />
          <Textarea
            style={{
              border: "2px solid blue",
              marginBottom: 10,
            }}
            noOfLines={100}
            size="lg"
            value={description}
            onChange={(e: any) => setDescription(e.target.value)}
            placeholder="Notification Body"
          />
          <Button
            onClick={async () => {
              await dispatch(
                sendNotificationThunk({ title: title, message: description })
              );
              //   if (dat.meta.requestStatus === "fulfilled") {
              //     // setData(dat.payload);
              //   }
            }}
            color={"white"}
            size="lg"
            background={"blue.500"}
          >
            {loading ? <Spinner /> : " Send Push Notification"}
          </Button>
        </Card>

        <Flex direction={"column"}>
          {data && (
            <Banner success={data.success_count} failure={data.failure_count} />
          )}
        </Flex>
      </Grid>
      {/* Delete Product */}
    </Box>
  );
}
