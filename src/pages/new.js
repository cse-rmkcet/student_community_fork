import { createNewPost } from "@/lib/api-calls/posts";
import prisma from "@/lib/prisma";
import { createPostSchema, parseZodErrors } from "@/lib/validations";
import {
  Button,
  Input,
  InputGroup,
  InputRightElement,
  Select,
  Switch,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  useToast,
} from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import { getServerSession } from "next-auth";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";
import { BsFillImageFill } from "react-icons/bs";
import { HiOutlineUpload } from "react-icons/hi";
import { IoSaveSharp } from "react-icons/io5";
import { MdOutlineCategory, MdTitle } from "react-icons/md";
import MarkdownEditor from "../components/editor";
import RenderMarkdown from "../components/render-markdown";
import { authOptions } from "./api/auth/[...nextauth]";

export async function getServerSideProps({ req, res }) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const allCategories = await prisma.category.findMany({});

  return {
    props: {
      allCategories,
    },
  };
}

const fields = [
  {
    name: "title",
    rightElement: <MdTitle />,
    placeholder: "Post title",
  },
  {
    name: "bannerImage",
    rightElement: <BsFillImageFill />,
    placeholder: "Banner image",
  },
];

const CreateNewPost = ({ allCategories }) => {
  const toast = useToast();
  const router = useRouter();
  const [content, setContent] = useState("");

  const [inputs, setInputs] = useState({
    title: "",
    bannerImage: "",
    categoryId: null,
    newCategory: "",
    publish: false,
  });

  const [errors, setErrors] = useState({
    title: null,
    bannerImage: null,
  });

  const mutation = useMutation(createNewPost, {
    onError: ({ response: { data } }) => {
      toast({
        title: data.error,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    },
    onSuccess: ({ redirect, message }) => {
      toast({
        title: message,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      router.push(redirect);
    },
  });

  const handleInputChange = ({ target: { value, name } }) => {
    setInputs((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "newCategory" ? { categoryId: null } : {}),
    }));
    setErrors((p) => ({ ...p, [name]: null }));
  };

  const handleCreate = () => {
    if (content.trim().length < 100) {
      toast({
        title: "Content must contain atleast 100 characters",
        status: "warning",
        duration: 2000,
        isClosable: true,
      });
      return;
    }

    let postData = { ...inputs, content };

    // Check the form inputs for error
    let parsedInputs = createPostSchema.safeParse(postData);

    // Map through the errors and get then in the right format
    if (!parsedInputs.success) {
      setErrors((p) => ({ ...p, ...parseZodErrors(parsedInputs) }));
      return;
    }

    mutation.mutate(postData);
  };

  return (
    <>
      <Head>
        <title>Create a new Post</title>
        <meta
          name="description"
          content="Platform for students within institutions to interact"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.png" />
      </Head>
      <div>
        <div className="flex flex-col items-center justify-center gap-5 py-10 lg:flex-row lg:items-start xl:gap-10  2xl:gap-20">
          <div className="order-2 flex w-[90dvw] flex-col gap-10 md:w-[70dvw] lg:order-1 lg:w-[60dvw] xl:w-[50dvw]">
            {fields.map((f, idx) => (
              <InputGroup key={idx} className="flex flex-col">
                <Input
                  value={inputs[f.name]}
                  name={f.name}
                  focusBorderColor="purple.600"
                  placeholder={f.placeholder}
                  onChange={handleInputChange}
                />
                {f.rightElement && (
                  <InputRightElement>{f.rightElement}</InputRightElement>
                )}
                <span className="mt-1 text-red-400">{errors[f.name]}</span>
              </InputGroup>
            ))}
            <Tabs variant="line" colorScheme="purple">
              <TabList>
                <Tab>Write</Tab>
                <Tab>Preview</Tab>
              </TabList>
              <TabPanels className="max-h-[60dvh] min-h-[30dvh] overflow-y-auto">
                <TabPanel>
                  <MarkdownEditor value={content} onChange={setContent} />
                </TabPanel>
                <TabPanel>
                  <article className="prose max-w-[85dvw]  dark:prose-invert">
                    {content.trim() !== "" ? (
                      <RenderMarkdown content={content} />
                    ) : (
                      <div className="text-center font-medium text-slate-500 dark:text-slate-400">
                        Start typing to see the preview
                      </div>
                    )}
                  </article>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </div>
          <div className="order-1 flex h-fit flex-col gap-5 p-2 lg:sticky lg:top-24 lg:order-2">
            <h2 className="self-center text-xl dark:text-slate-300">Options</h2>
            <InputGroup className="flex flex-col">
              <Input
                focusBorderColor="purple.600"
                isDisabled={Boolean(inputs.categoryId)}
                value={inputs.newCategory}
                name="newCategory"
                placeholder={"Create a new category"}
                onChange={handleInputChange}
              />
              <InputRightElement>
                <MdOutlineCategory />
              </InputRightElement>
              <span className="mt-1 text-red-400">{errors.newCategory}</span>
            </InputGroup>
            <Select
              focusBorderColor="purple.600"
              onChange={handleInputChange}
              name="categoryId"
              isDisabled={inputs.newCategory !== ""}
              placeholder="Choose a category"
            >
              {allCategories?.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </Select>

            <div className="flex items-center gap-2">
              <span>Publish now</span>
              <Switch
                colorScheme="purple"
                isChecked={inputs.publish}
                onChange={(e) => {
                  setInputs((p) => ({ ...p, publish: e.target.checked }));
                }}
              />
            </div>
            <Button
              variant="outline"
              colorScheme="purple"
              isLoading={mutation.isLoading}
              leftIcon={inputs.publish ? <HiOutlineUpload /> : <IoSaveSharp />}
              onClick={handleCreate}
            >
              {inputs.publish ? "Publish" : "Save as draft"}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

CreateNewPost.withLayout = { showCommunityInfo: false };

export default CreateNewPost;
