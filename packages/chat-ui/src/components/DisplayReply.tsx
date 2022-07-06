import { Avatar, Box, HStack, Text } from "@chakra-ui/react";
import { MessageType } from "@strata-foundation/chat";
import { truncatePubkey } from "@strata-foundation/react";
import React, { useMemo } from "react";
import { useAsync } from "react-async-hook";
import {
  IMessageWithPending,
  useUsernameFromIdentifierCertificate,
  useWalletProfile,
} from "../hooks";

const STYLE = {
  color: "gray.500",
  _hover: {
    cursor: "pointer",
    color: "black",
    _dark: {
      color: "white",
    },
  },
};

const BEFORE_STYLE = {
  content: `""`,
  position: "absolute",
  left: "50%",
  top: "8px",
  width: "2px",
  height: "12px",
  bg: "gray.300",
};

const AFTER_STYLE = {
  content: `""`,
  position: "absolute",
  left: "50%",
  top: "8px",
  width: "20px",
  height: "2px",
  bg: "gray.300",
};

export function DisplayReply({
  reply,
  htmlAllowList,
  scrollToMessage,
}: {
  reply: IMessageWithPending;
  htmlAllowList: any;
  scrollToMessage: (id: string) => void;
}) {
  const { result: decodedMessage } = useAsync(reply.getDecodedMessage, []);
  const { info: profile } = useWalletProfile(reply.sender);
  const { username, loading: loadingUsername } =
    useUsernameFromIdentifierCertificate(
      profile?.identifierCertificateMint,
      reply.sender
    );
  const name = useMemo(
    () => username || (reply.sender && truncatePubkey(reply.sender)),
    [username, reply?.sender?.toBase58()]
  );

  return (
    <HStack
      p={1}
      pb={0}
      w="full"
      align="start"
      spacing={2}
      fontSize="xs"
      overflow="hidden"
    >
      <Box
        w="36px"
        h="100%"
        flexShrink={0}
        position="relative"
        _before={BEFORE_STYLE}
        _after={AFTER_STYLE}
        _dark={{
          _before: {
            bg: "gray.700",
          },
          _after: {
            bg: "gray.700",
          },
        }}
      />
      <HStack
        w="full"
        gap={0}
        spacing={1}
        onClick={() => scrollToMessage(reply.id)}
        {...STYLE}
      >
        <Avatar size="2xs" src={profile?.imageUrl} />
        <Text
          fontSize="xs"
          fontWeight="semibold"
          color="green.500"
          _dark={{ color: "green.200" }}
        >
          {name}
        </Text>
        {decodedMessage ? (
          // successfully decoded
          <>
            {reply.type === MessageType.Text ? (
              <Text w={{ base: "70%", md: "full" }} isTruncated>
                {decodedMessage.text}
              </Text>
            ) : reply.type === MessageType.Html ? (
              <Text w={{ base: "70%", md: "full" }} isTruncated>
                {decodedMessage.html?.replace(/<[^>]*>?/gm, "")}
              </Text>
            ) : (
              <Text>Click to see attachment</Text>
            )}
          </>
        ) : (
          // need to fetch more messages
          <Text>Click to find reply</Text>
        )}
      </HStack>
    </HStack>
  );
}