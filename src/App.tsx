import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import Form from "react-bootstrap/Form";
import {
  FormErrorMessage,
  FormLabel,
  FormControl,
  Input,
  Button,
  Text,
  Card,
  Box,
  Select,
  Link,
  Tabs,
  Tab,
  TabList,
  TabPanels,
  TabPanel,
} from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";
import { CheckIcon, InfoIcon } from "@chakra-ui/icons";
import { validateInn, validateSnils } from "./helpers/validate";
import toBase64 from "./helpers/toBase64";

const validateEmail = (email: string): boolean => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

const App = ({}) => {
  const [isBtnDisabled, setBtnDisabled] = useState(false);
  const [orderNumber, setOrderNumber] = useState(null);
  const toast = useToast();
  const [locations, setLocations] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState({
    snils: null as unknown as File,
    inn: null as unknown as File,
    photo: null as unknown as File,
  });
  const filePassportInputRef = useRef<HTMLInputElement>();
  const fileSnilsInputRef = useRef<HTMLInputElement>();

  const {
    handleSubmit,
    register,
    setValue,
    getValues,
    getFieldState,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({ mode: "all" });

  const API_URL = "https://lk.novorostorgi.ru/api/v1";
  const BASE_URL = "https://elpod.novorostorgi.ru/api/api";
  // const BASE_URL = "http://localhost:3080";

  const watchFiles = watch(["file_inn", "file_snils", "file_passport"]);
  const watchPassportData = watch([
    "passport_series",
    "passport_number",
    "passport_date",
    "passport_code",
  ]);
  const watchSnilsData = watch("snils_number");
  const watchInnData = watch("person_inn");

  const isPassportDataFilled =
    // !!watchPassportData.find((item) => Object.hasOwn(errors, item)) &&
    watchPassportData.filter((item) => item && item?.trim()?.length > 0)
      ?.length === watchPassportData.length
      ? true
      : false;

  const isInnDataFilled =
    !!(watchInnData && watchInnData?.trim()?.length) &&
    !Object.hasOwn(errors, "person_inn");
  const isSnilsDataFilled = !!(
    watchSnilsData &&
    watchSnilsData?.trim()?.length &&
    !Object.hasOwn(errors, "snils_number")
  );

  const isInnFileUploaded = !!(watchFiles[0] && watchFiles[0][0]?.name);
  const isSnilsFileUploaded = !!(watchFiles[1] && watchFiles[1][0]?.name);
  const isPassportFileUploaded = !!(watchFiles[2] && watchFiles[2][0]?.name);

  const onSubmit = async (values) => {
    const innFile = values?.file_snils?.length
      ? await toBase64(values.file_snils[0])
      : null;
    const snilsFile = await toBase64(values.file_snils[0]);
    const passportFile = await toBase64(values.file_passport[0]);
    values = {
      ...values,
      location_id: values.location.toString(),
      location_label: locations.find(
        (l) => l.id.toString() === values.location.toString()
      )?.label,
      file_inn: innFile,
      file_snils: snilsFile,
      file_passport: passportFile,

      // file_inn: values?.file_inn?.length ? values?.file_inn[0] : null,
      // file_snils: values?.file_snils?.length ? values?.file_snils[0] : null,
      // file_passport: values?.file_passport?.length
      //   ? values?.file_passport[0]
      //   : null,
    };

    // delete values["file_inn"];
    // delete values["file_snils"];
    // delete values["file_passport"];
    delete values["location"];
    console.log("vvvv", values);
    // const formData = new FormData();

    // Object.keys(values).map((key) => formData.append(key, values[key]));
    // formData.append("file_inn", values.file_inn);
    // formData.append("file_snils", values.file_snils);
    // formData.append("file_passport", values.file_passport);

    // console.log("ffff", formData);
    try {
      const { data: data1 } = await axios.post(
        // "https://elpod.novorostorgi.ru/api/v1/lead/add",
        "https://admin.novorostorgi.ru/api/v1/lead/add",
        values
        // `${BASE_URL}/test`,
        // formData
      ); /* {
        formData,
        // ...values,
        date_time:
          new Date().toLocaleTimeString("ru-RU", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            timeZone: "Asia/Yekaterinburg",
          }) +
          " " +
          new Date().toLocaleDateString("ru-RU", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            timeZone: "Asia/Yekaterinburg",
          }),
      }); */
      // if (!data1.data.id) return;
      const number = data1.data.id;
      setOrderNumber(data1.id);
      values = { ...values, order_number: data1.id };

      // const { data: data2 } = await axios.post(
      //   `${API_URL}/ep_request/send`,
      //   values
      // );
      toast({
        position: "top",
        title: `Ваша заявка номер ${number} отправлена. В ближайшее время с Вами свяжется оператор`,
        // title: 'Заявка успешно отправлена. В ближайшее время с вами свяжется сотрудник',
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (err) {
      setBtnDisabled(true);
      setTimeout(() => setBtnDisabled(false), 4500);
      toast({
        position: "top",
        title:
          "Возникла ошибка при отправке заявки. Пожалуйста попробуйте повторить запрос позже",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const fetchLocations = async () => {
    const { data } = await axios.get(`${BASE_URL}/locations`);
    if (!data?.length) return;
    setLocations(data);
    setValue("location", data[0]?.id);
  };

  console.log("errrr", errors);

  useEffect(() => {
    fetchLocations();
  }, []);

  return (
    <Box p={4}>
      <div className="row">
        <div className="col-md-8 offset-md-2">
          <Box boxShadow="xl" paddingTop="2rem" borderRadius="2xl">
            <form onSubmit={handleSubmit(onSubmit)}>
              <Text
                textAlign="center"
                fontSize="3xl"
                fontWeight="bold"
                marginBottom="0.5rem"
              >
                Заявка на получение электронной подписи
              </Text>
              <hr />
              <Text textAlign="center" fontSize="sm" marginTop="0.5rem">
                Чтобы приступить к оформлению электронной подписи в партнерском
                Удостоверяющем центре, заполните поля информации в форме ниже
              </Text>
              <Card
                paddingX="2rem"
                paddingBottom="2rem"
                paddingTop="2rem"
                marginTop="2rem"
              >
                <div
                  style={{
                    // overflowY: "scroll", border: "1px solid #90cdf4",
                    padding: "1rem",
                    borderRight: 0,
                    marginTop: "2rem",
                    // height: "250px"
                  }}
                >
                  {/* <Text fontSize='1xl' fontWeight='bold' marginBottom="0.5rem" style={{ alignItems: "center" }}><InfoIcon /></Text> */}
                  <p>
                    <InfoIcon />
                    &nbsp;&nbsp;Уважаемые коллеги!
                  </p>
                  <p>
                    Для получения электронной подписи (ЭП) для руководителя
                    организации Вам необходимо ознакомиться с кратким порядком
                    получения услуги. Оказание услуги регулируется Федеральным
                    законом "Об электронной подписи" от 06.04.2011 N 63-ФЗ. Для
                    получения услуги необходимо заполнить нижеследующие поля:
                  </p>
                  <ul
                    style={{
                      marginLeft: "0.5rem",
                      marginInlineStart: "0.5rem",
                    }}
                  >
                    <li style={{ marginInlineStart: "1rem" }}>
                      Наименование организации
                    </li>
                    <li style={{ marginInlineStart: "1rem" }}>
                      ИНН организации организации
                    </li>
                    <li style={{ marginInlineStart: "1rem" }}>
                      ИНН руководителя организации
                    </li>
                    <li style={{ marginInlineStart: "1rem" }}>
                      ФИО руководителя организации
                    </li>
                    <li style={{ marginInlineStart: "1rem" }}>Телефон</li>
                    <li style={{ marginInlineStart: "1rem" }}>
                      Адрес эл. почты
                    </li>
                  </ul>
                  <p className="mt-3">
                    Далее выбрать из представленного списка удобный для Вас
                    пункт выдачи.
                  </p>
                  <p className="mt-2">
                    После отправки формы с Вами свяжется оператор, который
                    согласует дату и время оказания услуги, удобную для
                    заявителя.
                  </p>
                  <p className="mt-2">
                    При получении в точке выдачи при Вас должен быть следующий
                    пакет документов:
                  </p>
                  <ul
                    style={{
                      marginLeft: "0.5rem",
                      marginInlineStart: "0.5rem",
                    }}
                  >
                    <li style={{ marginInlineStart: "1rem" }}>
                      Паспорт руководителя организации
                    </li>
                    <li style={{ marginInlineStart: "1rem" }}>
                      СНИЛС руководителя организации
                    </li>
                    <li style={{ marginInlineStart: "1rem" }}>
                      ИНН руководителя организации
                    </li>
                    <li style={{ marginInlineStart: "1rem" }}>
                      Печать организации
                    </li>
                  </ul>
                  <p className="mt-4">
                    При отправке заполненной формы заявитель соглашается с
                    обработкой данных, и их хранением, согласно Федерального
                    закона "О персональных данных" от 27.07.2006 N 152-ФЗ.
                  </p>
                </div>
                <FormControl isInvalid={!!errors.org_title} mt="2.5rem">
                  <FormLabel fontSize="md">Наименование организации</FormLabel>
                  <Input
                    id="org_title"
                    {...register("org_title", {
                      required: "Поле обязательное для заполнения",
                    })}
                  />
                  <FormErrorMessage>
                    {errors.org_title && errors.org_title.message}
                  </FormErrorMessage>
                </FormControl>
                <FormControl isInvalid={!!errors.org_inn} mt="1rem">
                  <FormLabel fontSize="md">ИНН организации</FormLabel>
                  <Input
                    id="org_inn"
                    {...register("org_inn", {
                      required: "Поле обязательное для заполнения",
                      validate: (value) => {
                        return value.trim().length === 10
                          ? validateInn(value)
                          : "Введен неверный ИНН организации";
                      },
                    })}
                  />
                  <FormErrorMessage>
                    {errors.org_inn && errors.org_inn.message}
                  </FormErrorMessage>
                </FormControl>
                {/* <FormControl isInvalid={!!errors.person_inn} mt="1rem">
                  <FormLabel fontSize="md">
                    ИНН руководителя организации
                  </FormLabel>
                  <Input
                    id="person_inn"
                    {...register("person_inn", {
                      required: "Поле обязательное для заполнения",
                      validate: (value) => {
                        return value.trim().length === 12
                          ? validateInn(value)
                          : "Введен неверный ИНН физического лица";
                      },
                    })}
                  />
                  <FormErrorMessage>
                    {errors.person_inn && errors.person_inn.message}
                  </FormErrorMessage>
                </FormControl> */}
                <FormControl isInvalid={!!errors.person_fullname} mt="1rem">
                  <FormLabel fontSize="md">
                    ФИО руководителя организации
                  </FormLabel>
                  <Input
                    id="person_fullname"
                    placeholder="Иванов Иван Иванович"
                    {...register("person_fullname", {
                      required: "Поле обязательное для заполнения",
                      validate: (value) =>
                        value.split(" ").length < 3 /* ||
                        value
                          .split(" ")
                          .filter((text) => text.trim().length === 0).length > 0 */
                          ? "Введите ФИО в формате Иванов Иван Иванович"
                          : true,
                    })}
                  />
                  <FormErrorMessage>
                    {errors.person_fullname && errors.person_fullname.message}
                  </FormErrorMessage>
                </FormControl>
                <FormControl isInvalid={!!errors.person_phone_number} mt="1rem">
                  <FormLabel fontSize="md">Контактный номер телефона</FormLabel>
                  <Input
                    id="person_phone_number"
                    {...register("person_phone_number", {
                      required: "Поле обязательное для заполнения",
                    })}
                  />
                  <FormErrorMessage>
                    {errors.person_phone_number &&
                      errors.person_phone_number.message}
                  </FormErrorMessage>
                </FormControl>
                <FormControl isInvalid={!!errors.person_email} mt="1rem">
                  <FormLabel fontSize="md">Адрес электронной почты</FormLabel>
                  <Input
                    id="person_email"
                    {...register("person_email", {
                      required: "Поле обязательное для заполнения",
                      validate: (value) => {
                        return validateEmail(value)
                          ? true
                          : "Введен некорректный email адрес";
                      },
                    })}
                  />
                  <FormErrorMessage>
                    {errors.person_email && errors.person_email.message}
                  </FormErrorMessage>
                </FormControl>
                <FormControl isInvalid={!!errors.location} mt="1rem">
                  <FormLabel fontSize="md">Выберите пункт выдачи</FormLabel>
                  <Select
                    id="location"
                    {...register("location", {
                      required: "Поле обязательное для заполнения",
                    })}
                  >
                    {locations?.map((loc) => (
                      <option value={loc.id}>{loc.label}</option>
                    ))}
                  </Select>
                  <FormErrorMessage>
                    {errors.location && errors.location.message}
                  </FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={!!errors.location} mt="3rem">
                  <FormLabel fontSize="md">
                    Заполните необходимые данные руководителя организации
                  </FormLabel>
                  <Tabs variant="enclosed">
                    <TabList>
                      <Tab>
                        ИНН &nbsp;&nbsp;
                        {isInnDataFilled ? (
                          <CheckIcon color="whatsapp.400" />
                        ) : null}
                      </Tab>
                      <Tab>
                        СНИЛС &nbsp;&nbsp;
                        {isSnilsDataFilled && isSnilsFileUploaded ? (
                          <CheckIcon color="whatsapp.400" />
                        ) : null}
                      </Tab>
                      <Tab>
                        Паспортные данные &nbsp;&nbsp;
                        {isPassportDataFilled && isPassportFileUploaded ? (
                          <CheckIcon color="whatsapp.400" />
                        ) : null}
                      </Tab>
                    </TabList>
                    <TabPanels>
                      <TabPanel>
                        <div className="row">
                          <div className="col-md-4">
                            Файл: <br />
                            <Text
                              as="p"
                              color="whiteAlpha.600"
                              fontSize="xs"
                              mt="1rem"
                              fontWeight="normal"
                            >
                              При наличии свидетельства ИНН ФЛ в бумажном виде
                            </Text>
                          </div>

                          <div className="col-md-7">
                            {" "}
                            <b>
                              {watchFiles.length && watchFiles[0]?.length ? (
                                watchFiles[0][0].name
                              ) : (
                                <>
                                  <Link
                                    color="blue.500"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      document
                                        .querySelector("#file_inn")
                                        .click();
                                      // fileSnilsInputRef.current?.click();
                                    }}
                                  >
                                    Загрузить скан документа
                                  </Link>
                                  <Text
                                    as="p"
                                    color="whiteAlpha.600"
                                    fontSize="xs"
                                    mt="1rem"
                                    fontWeight="normal"
                                  >
                                    Необходимо загрузить скан документа формата
                                    А4
                                  </Text>
                                </>
                              )}
                              {isInnFileUploaded ? (
                                <>
                                  &nbsp;&nbsp;
                                  <CheckIcon color="whatsapp.400" />
                                </>
                              ) : null}
                            </b>
                          </div>
                        </div>
                        <br />
                        <FormControl isInvalid={!!errors.snils_number}>
                          <div className="row w-100 align-items-center">
                            <div className="col-md-4">
                              <FormLabel fontSize="md">Номер ИНН:</FormLabel>
                            </div>
                            <div className="col-md-7">
                              <Input
                                id="person_inn"
                                {...register("person_inn", {
                                  required: "Поле обязательное для заполнения",
                                  validate: (value) => {
                                    // value.trim().length === 12c
                                    // console.log(
                                    //   "validateInn",
                                    //   validateInn(value)
                                    // );
                                    return validateInn(value);
                                  },
                                  // : "Введен неверный ИНН физического лица",
                                })}
                              />
                              <FormErrorMessage>
                                {errors.person_inn && errors.person_inn.message}
                              </FormErrorMessage>
                            </div>
                            <div className="col-md-1">
                              {isInnDataFilled ? (
                                <CheckIcon color="whatsapp.400" mt="-1rem" />
                              ) : null}
                            </div>
                          </div>
                        </FormControl>
                        <Input
                          type="file"
                          accept="image/*,.pdf"
                          multiple={false}
                          id="file_inn"
                          {...register("file_inn", {
                            required: "Поле обязательное для заполнения",
                          })}
                          className="d-none"
                        />
                      </TabPanel>
                      <TabPanel>
                        <div className="row">
                          <div className="col-md-4">Файл: </div>
                          <div className="col-md-7">
                            {" "}
                            <b>
                              {watchFiles.length && watchFiles[1]?.length ? (
                                watchFiles[1][0].name
                              ) : (
                                <Link
                                  color="blue.500"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    document
                                      .querySelector("#file_snils")
                                      .click();
                                    // fileSnilsInputRef.current?.click();
                                  }}
                                >
                                  Загрузить скан документа
                                </Link>
                              )}
                            </b>
                            {isSnilsFileUploaded ? (
                              <>
                                &nbsp;&nbsp;
                                <CheckIcon color="whatsapp.400" />
                              </>
                            ) : null}
                          </div>
                        </div>
                        <br />
                        <FormControl isInvalid={!!errors.snils_number}>
                          <div className="row w-100 align-items-center">
                            <div className="col-md-4">
                              <FormLabel fontSize="md">Номер СНИЛС</FormLabel>
                            </div>
                            <div className="col-md-7">
                              <Input
                                id="snils_number"
                                {...register("snils_number", {
                                  required: "Поле обязательное для заполнения",
                                  validate: (value) => {
                                    return validateSnils(value);
                                  },
                                })}
                              />
                              <FormErrorMessage>
                                {errors.snils_number &&
                                  errors.snils_number.message}
                              </FormErrorMessage>
                            </div>
                            <div
                              className="col-md-1"
                              style={{ marginTop: "-1rem" }}
                            >
                              {isInnDataFilled ? (
                                <CheckIcon color="whatsapp.400" />
                              ) : null}
                            </div>
                          </div>
                        </FormControl>
                        <Input
                          type="file"
                          accept="image/*,.pdf"
                          multiple={false}
                          id="file_snils"
                          {...register("file_snils", {
                            required: "Поле обязательное для заполнения",
                          })}
                          className="d-none"
                        />
                      </TabPanel>
                      <TabPanel>
                        <div className="row">
                          <div className="col-md-4">Файл: </div>
                          <div className="col-md-7">
                            {" "}
                            <b>
                              {watchFiles.length && watchFiles[2]?.length ? (
                                watchFiles[2][0].name
                              ) : (
                                <>
                                  <Link
                                    color="blue.500"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      document
                                        .querySelector("#file_passport")
                                        .click();
                                      // filePassportInputRef.current?.click();
                                    }}
                                  >
                                    Загрузить скан документа
                                  </Link>

                                  <Text
                                    as="p"
                                    color="whiteAlpha.600"
                                    fontSize="xs"
                                    mt="1rem"
                                    fontWeight="normal"
                                  >
                                    Необходимо загрузить скан разворотов
                                    страницы с фото и страницы c пропиской
                                  </Text>
                                </>
                              )}
                              {isPassportFileUploaded ? (
                                <>
                                  &nbsp;&nbsp;
                                  <CheckIcon color="whatsapp.400" />
                                </>
                              ) : null}
                            </b>
                          </div>
                          <Text fontSize="2xl" mt="2rem">
                            Паспортные данные{" "}
                            {isPassportDataFilled ? (
                              <>
                                &nbsp;&nbsp;
                                <CheckIcon color="whatsapp.400" />
                              </>
                            ) : null}
                          </Text>
                          <div className="col-md-6 mt-3">
                            <FormControl isInvalid={!!errors.passport_series}>
                              <FormLabel fontSize="md">Серия</FormLabel>
                              <Input
                                id="passport_series"
                                {...register("passport_series", {
                                  required: "Поле обязательное для заполнения",
                                })}
                              />
                              <FormErrorMessage>
                                {errors.passport_series &&
                                  errors.passport_series.message}
                              </FormErrorMessage>
                            </FormControl>
                          </div>
                          <div className="col-md-6 mt-3">
                            <FormControl isInvalid={!!errors.passport_number}>
                              <FormLabel fontSize="md">Номер</FormLabel>
                              <Input
                                id="passport_number"
                                {...register("passport_number", {
                                  required: "Поле обязательное для заполнения",
                                })}
                              />
                              <FormErrorMessage>
                                {errors.passport_number &&
                                  errors.passport_number.message}
                              </FormErrorMessage>
                            </FormControl>
                          </div>
                          <div className="col-md-6">
                            <FormControl
                              isInvalid={!!errors.passport_date}
                              mt="1rem"
                            >
                              <FormLabel fontSize="md">Дата выдачи</FormLabel>
                              <Input
                                id="passport_date"
                                type="datetime-local"
                                {...register("passport_date", {
                                  required: "Поле обязательное для заполнения",
                                })}
                              />
                              <FormErrorMessage>
                                {errors.passport_date &&
                                  errors.passport_date.message}
                              </FormErrorMessage>
                            </FormControl>
                          </div>
                          <div className="col-md-6">
                            <FormControl
                              isInvalid={!!errors.passport_code}
                              mt="1rem"
                            >
                              <FormLabel fontSize="md">
                                Код подразделения
                              </FormLabel>
                              <Input
                                id="passport_code"
                                {...register("passport_code", {
                                  required: "Поле обязательное для заполнения",
                                })}
                              />
                              <FormErrorMessage>
                                {errors.passport_code &&
                                  errors.passport_code.message}
                              </FormErrorMessage>
                            </FormControl>
                          </div>
                        </div>
                        <Input
                          type="file"
                          accept="image/*,.pdf"
                          multiple={false}
                          id="file_passport"
                          {...register("file_passport", {
                            required: "Поле обязательное для заполнения",
                          })}
                          // ref={filePassportInputRef}
                          className="d-none"
                        />
                        <FormErrorMessage>
                          {errors.file_passport && errors.file_passport.message}
                        </FormErrorMessage>
                      </TabPanel>
                    </TabPanels>
                  </Tabs>
                  <Text as="p" color="whiteAlpha.600" fontSize="sm" mt="1rem">
                    <b> Общие требования к файлам: </b>
                    Файлы дожны быть цветными сканами документов, либо
                    черно-белыми хорошего качества, либо фото без обрезания
                    краев. Максимальный размер загружаемого файла каждого
                    документа не должен превышать 16 Мб. Доступные форматы
                    файлов: *PDF, *JPG
                  </Text>
                </FormControl>
                {/* <Checkbox required style={{ margin: "1rem 0" }}>Даю согласие на обработку моих персональных данных в соответствии с <Link color='teal.500' href='#'>
                  Политикой обработки персональных данных</Link></Checkbox> */}

                {/* <Textarea style={{ pointerEvents: "none" }} disabled>dad<br />gaga</Textarea> */}
                <Button
                  mt="2rem"
                  colorScheme="blue"
                  // isLoading={isSubmitting}
                  disabled={isBtnDisabled}
                  type="submit"
                >
                  Отправить
                </Button>
              </Card>
            </form>
          </Box>
        </div>
      </div>
    </Box>
  );
};

export default App;
