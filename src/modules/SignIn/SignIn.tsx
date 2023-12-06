import {
  Box,
  Center,
  Flex,
  Heading,
  Input,
  Link,
  Spinner,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import * as yup from "yup";

const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT;
const LoginForm = () => {
  const [isSubmit, setIsSubmit] = useState(false);
  const router = useRouter();
  const toast = useToast();

  const queryParams = useSearchParams();
  const params = queryParams.get("query");

  const validationSchema = yup.object().shape({
    email: yup.string().required("email is required"),
    password: yup.string().required("Password is required"),
  });
  const handleSubmit = async (
    values: any,
    { setSubmitting, setErrors }: any
  ) => {
    axios
      .post(`${API_ENDPOINT}/auth/signin`, values)
      .then((response) => {
        setIsSubmit(false);
        console.log(response);
        const { token } = response.data;
        const id = response.data.data._id;
        // Store the token in a cookie
        document.cookie = `token=${token}; Path=/`;

        toast({
          title: response.data.status,
          description: response.data.message,
          status: "success",
          duration: 500,
          isClosable: true,
        });
        router.push(`/?id=${id}`);
      })
      .catch((error) => {
        setSubmitting(false);
        setIsSubmit(false);
        setErrors({ password: "Invalid credentials" });
        toast({
          title: "Error.",
          description: "Invalid credentials",
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      });
  };

  return (
    <Flex
      minH={{ md: "100vh", base: "100vh" }}
      align={"center"}
      justify={"center"}
      // bg="blue.500"
    >
      <Stack
        spacing={8}
        mx={"auto"}
        w={{ md: "40%", base: "unset" }}
        py={12}
        px={6}
      >
        <Stack align={"center"}>
          <Heading as={"i"} fontSize={"4xl"}>
            Event Scheduler
          </Heading>
        </Stack>

        <Box borderRadius={"lg"} bg={"blue.700"} p={4} color={"white"}>
          <Center>
            {" "}
            <Heading fontSize="xl" fontWeight="medium" mt={6} mb={8}>
              Sign In
            </Heading>
          </Center>
          <Formik
            initialValues={{ email: "", password: "" }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form>
                <Box marginBottom="2" mx={{ md: 12 }}>
                  <Heading mb={2} fontWeight={"medium"} fontSize={"sm"}>
                    Email
                  </Heading>
                  <Field
                    // variant={"filled"}
                    as={Input}
                    type="text"
                    name="email"
                  />
                  <Box mt={2} color="red.500" fontSize="sm">
                    <ErrorMessage name="email" />
                  </Box>
                </Box>
                <Box marginBottom="2" mx={{ md: 12 }}>
                  <Heading mt={4} mb={2} fontWeight={"medium"} fontSize={"sm"}>
                    Password
                  </Heading>
                  <Field
                    // variant={"filled"}
                    as={Input}
                    type="password"
                    name="password"
                  />
                  <Box mt={2} color="red.500" fontSize="sm">
                    <ErrorMessage name="password" />
                  </Box>
                </Box>
                <Box mx={{ md: 12 }}>
                  <button
                    onClick={() => handleSubmit}
                    type="submit"
                    className={` mt-4 bg-blue-500 w-full hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded `}
                    // disabled={isSubmitting}
                  >
                    {isSubmit ? <Spinner /> : "Login"}
                  </button>
                </Box>

                <Stack mt={2} fontSize={"small"}>
                  <Text align={"center"}>
                    Dont have an account?{" "}
                    <Link
                      // fontWeight={"bold"}
                      href="../auth/sign-up"
                      color={"blue.200"}
                    >
                      Sign up
                    </Link>
                  </Text>
                  {!params && (
                    <Box>
                      <Flex justify={"center"} align={"center"}>
                        OR
                      </Flex>

                      <Text align={"center"}>
                        <Link
                          // fontWeight={"bold"}
                          href="../auth/sign-in?query=admin"
                          color={"blue.200"}
                        >
                          Forgotten Password?
                        </Link>
                      </Text>
                    </Box>
                  )}
                </Stack>
              </Form>
            )}
          </Formik>
        </Box>
      </Stack>
    </Flex>
  );
};

export default LoginForm;
