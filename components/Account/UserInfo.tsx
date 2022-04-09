import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
  SimpleGrid,
  Text,
  Tooltip,
  useDisclosure,
} from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { FaCheck, FaTimes } from 'react-icons/fa';
import fetcher from 'shared/utils/axiosFetcher';
import useSWR, { useSWRConfig } from 'swr';
import { UserResponse } from 'types/apiResponses';
import * as yup from 'yup';

import DeleteAccount from './DeleteAccount';

type Inputs = {
  name: string;
  street: string;
  street2: string;
  suburb: string;
  state: "WA" | "NT" | "SA" | "QLD" | "NSW" | "VIC" | "TAS" | "ACT";
  postcode: string;
};

const schema = yup.object().shape({
  name: yup.string().required(),
  street: yup.string().required(),
  street2: yup.string(),
  suburb: yup.string().required(),
  state: yup
    .string()
    .oneOf(["WA", "NT", "SA", "QLD", "NSW", "VIC", "TAS", "ACT"])
    .required(),
  postcode: yup.string().required(),
});

const UserInfo: React.FC<{ email: string }> = ({ email }) => {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { isOpen, onClose, onOpen } = useDisclosure();
  const { mutate } = useSWRConfig();
  const userResponse = useSWR<UserResponse>(`/api/user/${email}`, fetcher);
  const user = userResponse.data?.data;
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Inputs>({
    defaultValues: {
      name: user?.name || "",
      street: user?.street || "",
      street2: user?.street2 || "",
      suburb: user?.suburb || "",
      state: user?.state || "WA",
      postcode: user?.postcode || "",
    },
    resolver: yupResolver(schema),
  });

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      await axios.patch(`/api/user/${email}`, data);
      mutate(`/api/user/${email}`);
      setSuccess("Updated user information.");
    } catch (error) {
      setError("Error updating user.");
    }
  };

  useEffect(() => {
    if (error) {
      setTimeout(() => setError(""), 3000);
    }
  }, [error]);

  useEffect(() => {
    if (success) {
      setTimeout(() => setSuccess(""), 3000);
    }
  }, [success]);

  return (
    <Box as="form" onSubmit={handleSubmit(onSubmit)} p={4} borderWidth={1}>
      <Heading size="md" mb={2}>
        My Details
      </Heading>
      <FormControl mb={4}>
        <FormLabel>Name</FormLabel>
        <Input {...register("name")} colorScheme="yellow" />
        {errors.name && (
          <FormErrorMessage>{errors.name.message}</FormErrorMessage>
        )}
      </FormControl>
      <FormControl mb={4}>
        <FormLabel>Email</FormLabel>
        <InputGroup>
          <Input
            isDisabled
            value={user?.email || "No email"}
            colorScheme="yellow"
          />
          <Tooltip label={user?.emailVerified ? "Verified" : "Not Verified"}>
            <InputRightElement>
              {user?.emailVerified ? (
                <Icon as={FaCheck} color="yellow.500" />
              ) : (
                <Icon as={FaTimes} color="red.400" />
              )}
            </InputRightElement>
          </Tooltip>
        </InputGroup>
      </FormControl>
      <FormControl mb={4}>
        <FormLabel>Street Address</FormLabel>
        <Input {...register("street")} />
        {errors.street && (
          <FormErrorMessage>{errors.street.message}</FormErrorMessage>
        )}
      </FormControl>
      <FormControl mb={4}>
        <FormLabel>Street Address (Line 2)</FormLabel>
        <Input {...register("street2")} />
        {errors.street2 && (
          <FormErrorMessage>{errors.street2.message}</FormErrorMessage>
        )}
      </FormControl>
      <FormControl mb={4}>
        <FormLabel>Suburb</FormLabel>
        <Input {...register("suburb")} />
        {errors.suburb && (
          <FormErrorMessage>{errors.suburb.message}</FormErrorMessage>
        )}
      </FormControl>
      <SimpleGrid mb={4} columns={2} spacing={4}>
        <FormControl>
          <FormLabel>State</FormLabel>
          <Input {...register("state")} />
          {errors.state && (
            <FormErrorMessage>{errors.state.message}</FormErrorMessage>
          )}
        </FormControl>
        <FormControl>
          <FormLabel>Postcode</FormLabel>
          <Input {...register("postcode")} />
          {errors.postcode && (
            <FormErrorMessage>{errors.postcode.message}</FormErrorMessage>
          )}
        </FormControl>
      </SimpleGrid>
      {error && (
        <Text py={2} textColor="red.400">
          {error}
        </Text>
      )}
      {success && (
        <Text py={2} textColor="green.400">
          {success}
        </Text>
      )}
      <Flex justifyContent="flex-end">
        <ButtonGroup size="sm" variant="ghost">
          <Button colorScheme="red" onClick={onOpen}>
            Delete Account
          </Button>
          <Button type="submit" isLoading={isSubmitting} colorScheme="yellow">
            Save Changes
          </Button>
        </ButtonGroup>
      </Flex>
      <DeleteAccount
        email={user?.email ?? ""}
        isOpen={isOpen}
        onClose={onClose}
      />
    </Box>
  );
};

export default UserInfo;
