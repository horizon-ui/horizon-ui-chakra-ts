import React, { useState } from "react";
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
  Select,
} from "@chakra-ui/react";
import Banner from "../profile/components/Storage";
import Card from "components/card/Card";
import { useDispatch, useSelector } from "store";
import {
  sendNotificationThunk,
  sendVersionThunk,
} from "store/actions/userActions";
export type ServerResponse = {
  ok: boolean;
  success_count: number;
  failure_count: number;
};
export default function AppVersionScreen() {
  const [version, setVersion] = React.useState("");
  const [data, setData] = React.useState<ServerResponse | null>();
  const { pushNotificationLoading } = useSelector((state) => state.user);
  const brandColor = useColorModeValue("brand.500", "white");
  // Chakra Color Mode
  const dispatch = useDispatch();
  const textColor = useColorModeValue("secondaryGray.900", "white");
  const textColorBrand = useColorModeValue("brand.500", "white");
  const [platform, setPlatform] = useState<string>();
  const handleSelectChange = (event: any) => {
    setPlatform(event.target.value);
    console.log(`Selected value: ${event.target.value}`);
  };

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
          <Select placeholder="Select option" onChange={handleSelectChange}>
            <option value="android">Android</option>
            <option value="ioss">IOS</option>
          </Select>
          <Input
            type="text"
            style={{
              border: "2px solid blue",
              marginBottom: 10,
            }}
            noOfLines={100}
            size="lg"
            value={version}
            onChange={(e: any) => setVersion(e.target.value)}
            placeholder="Notification Body"
          />
          <Button
            onClick={async () => {
              let dat = await dispatch(
                sendVersionThunk({ platform: platform, version: version })
              );
              if (dat.meta.requestStatus === "fulfilled") {
                console.log("data", dat.payload);
                let datPayload: ServerResponse = dat.payload as ServerResponse;
                setData(datPayload);
                alert("App Version Updated for " + platform);
              }
            }}
            color={"white"}
            size="lg"
            background={"blue.500"}
          >
            {pushNotificationLoading ? <Spinner /> : "Update App Version"}
          </Button>
        </Card>

        <Flex direction={"column"}>
          {/* {data && (
            alert.al
          )} */}
        </Flex>
      </Grid>
      {/* Delete Product */}
    </Box>
  );
}
