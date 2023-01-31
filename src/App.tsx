import { useEffect, useState } from "react";
import axios from 'axios'
import { useForm } from "react-hook-form";
import Form from 'react-bootstrap/Form'
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
  Link, Checkbox, Editable, EditablePreview, EditableTextarea, Textarea
} from "@chakra-ui/react";
import { useToast } from '@chakra-ui/react'
import { InfoIcon } from '@chakra-ui/icons'

const validateEmail = (email: string): boolean => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

const App = ({

}) => {
  const [isBtnDisabled, setBtnDisabled] = useState(false)
  const [orderNumber, setOrderNumber] = useState(null)
  const toast = useToast()
  const [locations, setLocations] = useState([])
  const {
    handleSubmit,
    register,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm({ mode: "all" });
  const API_URL = "https://lk.novorostorgi.ru/api/v1"
  const BASE_URL = "https://elpod.novorostorgi.ru/api/api"

  const onSubmit = async (values) => {

    values = { ...values, location_id: values.location.toString(), location_label: locations.find(l => l.id.toString() === values.location.toString())?.label }
    console.log('vvvv', values)
    try {
      const { data: data1 } = await axios.post(`${BASE_URL}/ep_requests`, {
        ...values, date_time: new Date().toLocaleTimeString("ru-RU", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          timeZone: "Asia/Yekaterinburg",
        }) + " " + new Date().toLocaleDateString("ru-RU", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          timeZone: "Asia/Yekaterinburg",
        })
      })
      if (!data1.id) return
      setOrderNumber(data1.id)
      values = { ...values, order_number: data1.id }
      const { data: data2 } = await axios.post(`${API_URL}/ep_request/send`, values)
      toast({
        position: "top",
        title: `Ваша заявка номер ${data1.id} отправлена. В ближайшее время с Вами свяжется оператор`,
        // title: 'Заявка успешно отправлена. В ближайшее время с вами свяжется сотрудник',
        status: 'success',
        duration: 5000,
        isClosable: true,
      })
    }
    catch (err) {
      setBtnDisabled(true)
      setTimeout(() => setBtnDisabled(false), 4500)
      toast({
        position: "top",
        title: 'Возникла ошибка при отправке заявки. Пожалуйста попробуйте повторить запрос позже',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    }
  }

  const fetchLocations = async () => {
    const { data } = await axios.get(`${BASE_URL}/locations`)
    if (!data?.length) return
    setLocations(data)
    setValue('location', data[0]?.id)
  }

  console.log('errrr', errors)

  useEffect(() => { fetchLocations() }, [])

  return (
    <Box p={4}>
      <div className="row">
        <div className="col-md-8 offset-md-2">
          <Box boxShadow='xl' paddingTop="2rem" borderRadius="2xl">
            <form onSubmit={handleSubmit(onSubmit)}>
              <Text textAlign='center' fontSize='3xl' fontWeight='bold' marginBottom="0.5rem">Заявка на получение электронной подписи</Text>
              <hr />
              <Text textAlign='center' fontSize='sm' marginTop="0.5rem">Чтобы приступить к оформлению электронной подписи в партнерском Удостоверяющем центре, заполните поля информации в форме ниже</Text>
              <Card paddingX="2rem" paddingBottom="2rem" paddingTop="2rem" marginTop="2rem">
                <div style={{
                  // overflowY: "scroll", border: "1px solid #90cdf4",
                  padding: "1rem",
                  borderRight: 0,
                  marginTop: "2rem",
                  // height: "250px"
                }}>
                  {/* <Text fontSize='1xl' fontWeight='bold' marginBottom="0.5rem" style={{ alignItems: "center" }}><InfoIcon /></Text> */}
                  <p><InfoIcon />&nbsp;&nbsp;Уважаемые коллеги!</p>
                  <p>Для получения электронной подписи (ЭП) для руководителя организации  Вам необходимо ознакомиться с кратким порядком получения услуги.
                    Оказание услуги регулируется  Федеральным законом "Об электронной подписи" от 06.04.2011 N 63-ФЗ.
                    Для получения услуги необходимо заполнить нижеследующие поля:</p>
                  <ul style={{ marginLeft: "0.5rem", marginInlineStart: "0.5rem" }}>
                    <li style={{ marginInlineStart: "1rem" }}>Наименование организации</li>
                    <li style={{ marginInlineStart: "1rem" }}>ИНН организации организации</li>
                    <li style={{ marginInlineStart: "1rem" }}>ИНН руководителя организации</li>
                    <li style={{ marginInlineStart: "1rem" }}>ФИО руководителя организации</li>
                    <li style={{ marginInlineStart: "1rem" }}>Телефон</li>
                    <li style={{ marginInlineStart: "1rem" }}>Адрес эл. почты</li>
                  </ul>
                  <p className="mt-3">Далее выбрать из представленного списка удобный для Вас пункт выдачи.</p>
                  <p className="mt-2">
                    После отправки формы с Вами свяжется оператор, который согласует дату и время оказания услуги, удобную для заявителя.
                  </p>
                  <p className="mt-2">
                    При получении в точке выдачи при Вас должен быть следующий пакет документов:
                  </p>
                  <ul style={{ marginLeft: "0.5rem", marginInlineStart: "0.5rem" }}>
                    <li style={{ marginInlineStart: "1rem" }}>Паспорт руководителя организации</li>
                    <li style={{ marginInlineStart: "1rem" }}>СНИЛС руководителя организации</li>
                    <li style={{ marginInlineStart: "1rem" }}>ИНН руководителя организации</li>
                    <li style={{ marginInlineStart: "1rem" }}>Печать организации</li>
                  </ul>
                  <p className="mt-4">При отправке заполненной формы заявитель соглашается с обработкой данных, и их хранением, согласно Федерального закона "О персональных данных" от 27.07.2006 N 152-ФЗ.</p>
                </div>
                <FormControl isInvalid={!!errors.org_title} mt="2.5rem">
                  <FormLabel fontSize="md">Наименование организации</FormLabel>
                  <Input id="org_title" {...register("org_title", {
                    required: "Поле обязательное для заполнения"
                  })} />
                  <FormErrorMessage>
                    {errors.org_title && errors.org_title.message}
                  </FormErrorMessage>
                </FormControl>
                <FormControl isInvalid={!!errors.org_inn} mt="1rem">
                  <FormLabel fontSize="md">ИНН организации</FormLabel>
                  <Input id="org_inn" {...register("org_inn", {
                    required: "Поле обязательное для заполнения", validate: (value) => {
                      return value.trim().length === 10 ? true : "Введен неверный ИНН организации"
                    }
                  })} />
                  <FormErrorMessage>
                    {errors.org_inn && errors.org_inn.message}
                  </FormErrorMessage>
                </FormControl>
                <FormControl isInvalid={!!errors.person_inn} mt="1rem">
                  <FormLabel fontSize="md">ИНН руководителя организации</FormLabel>
                  <Input id="person_inn" {...register("person_inn", {
                    required: "Поле обязательное для заполнения", validate: (value) => {
                      return value.trim().length === 12 ? true : "Введен неверный ИНН физического лица"
                    }
                  })} />
                  <FormErrorMessage>
                    {errors.person_inn && errors.person_inn.message}
                  </FormErrorMessage>
                </FormControl>
                <FormControl isInvalid={!!errors.person_fullname} mt="1rem">
                  <FormLabel fontSize="md">ФИО руководителя организации</FormLabel>
                  <Input id="person_fullname" {...register("person_fullname", { required: "Поле обязательное для заполнения" })} />
                  <FormErrorMessage>
                    {errors.person_fullname && errors.person_fullname.message}
                  </FormErrorMessage>
                </FormControl>
                <FormControl isInvalid={!!errors.person_phone_number} mt="1rem">
                  <FormLabel fontSize="md">Контактный номер телефона</FormLabel>
                  <Input id="person_phone_number" {...register("person_phone_number", { required: "Поле обязательное для заполнения" })} />
                  <FormErrorMessage>
                    {errors.person_phone_number && errors.person_phone_number.message}
                  </FormErrorMessage>
                </FormControl>
                <FormControl isInvalid={!!errors.person_email} mt="1rem">
                  <FormLabel fontSize="md">Адрес электронной почты</FormLabel>
                  <Input id="person_email" {...register("person_email", {
                    required: "Поле обязательное для заполнения", validate: (value) => {
                      return validateEmail(value) ? true : "Введен некорректный email адрес"
                    }
                  })} />
                  <FormErrorMessage>
                    {errors.person_email && errors.person_email.message}
                  </FormErrorMessage>
                </FormControl>
                <FormControl isInvalid={!!errors.location} mt="1rem">
                  <FormLabel fontSize="md">Выберите пункт выдачи</FormLabel>
                  <Select id="location"  {...register("location", { required: "Поле обязательное для заполнения" })}>
                    {locations?.map(loc => (<option value={loc.id}>{loc.label}</option>))}
                  </Select>
                  <FormErrorMessage>
                    {errors.location && errors.location.message}
                  </FormErrorMessage>
                </FormControl>
                {/* <Checkbox required style={{ margin: "1rem 0" }}>Даю согласие на обработку моих персональных данных в соответствии с <Link color='teal.500' href='#'>
                  Политикой обработки персональных данных</Link></Checkbox> */}


                {/* <Textarea style={{ pointerEvents: "none" }} disabled>dad<br />gaga</Textarea> */}
                <Button mt="2rem" colorScheme="blue" isLoading={isSubmitting} disabled={isBtnDisabled} type="submit">
                  Отправить
                </Button>
              </Card>
            </form >
          </Box>
        </div>
      </div>
    </Box >
  );
};

export default App;
