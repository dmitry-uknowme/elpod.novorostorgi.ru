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


const App = ({

}) => {
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

    values = { ...values, location_id: values.location, location_label: locations.find(l => l.id.toString() === values.location.toString())?.label }
    console.log('vvvv', values)
    try {
      await axios.post(`${BASE_URL}/ep_requests`, values)
      const { data } = await axios.post(`${API_URL}/ep_request/send`, values)
      toast({
        title: 'Заявка успешно отправлена. В ближайшее время с вами свяжется сотрудник',
        status: 'success',
        duration: 9000,
        isClosable: true,
      })

    }
    catch (err) {
      toast({
        title: 'Возникла ошибка на сервере. Пожалуйста попробуйте повторить запрос позже',
        status: 'success',
        duration: 9000,
        isClosable: true,
      })
    }
  }

  const fetchLocations = async () => {
    const { data } = await axios.get(`${BASE_URL}/locations`)
    setLocations(data)
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
                <FormControl isInvalid={!!errors.org_title}>
                  <FormLabel fontSize="md">Наименование организации</FormLabel>
                  <Input id="org_title" {...register("org_title", {
                    required: "Поле обязательное для заполнения"
                  })} />
                  <FormErrorMessage>
                    {errors.org_title && errors.org_title.message}
                  </FormErrorMessage>
                </FormControl>
                <FormControl isInvalid={!!errors.org_inn}>
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
                  <FormLabel fontSize="md">ИНН физического лица</FormLabel>
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
                  <FormLabel fontSize="md">Фамилия Имя Отчество</FormLabel>
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
                  <Input id="person_email" {...register("person_email", { required: "Поле обязательное для заполнения" })} />
                  <FormErrorMessage>
                    {errors.person_email && errors.person_email.message}
                  </FormErrorMessage>
                </FormControl>
                <FormControl isInvalid={!!errors.location} mt="1rem">
                  <FormLabel fontSize="md">Выберите локацию</FormLabel>
                  <Select id="location"  {...register("location", { required: "Поле обязательное для заполнения" })}>
                    {locations?.map(loc => (<option value={loc.id}>{loc.label}</option>))}
                  </Select>
                  <FormErrorMessage>
                    {errors.location && errors.location.message}
                  </FormErrorMessage>
                </FormControl>
                <Checkbox required style={{ margin: "1rem 0" }}>Даю согласие на обработку моих персональных данных в соответствии с <Link color='teal.500' href='#'>
                  Политикой обработки персональных данных</Link></Checkbox>
                <Textarea style={{ pointerEvents: "none" }} disabled defaultValue="Инструкция..................................................................." />
                <Button mt="2rem" colorScheme="blue" isLoading={isSubmitting} type="submit">
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
