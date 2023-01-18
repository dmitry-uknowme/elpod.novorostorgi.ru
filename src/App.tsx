import { useState } from "react";
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
import { Divider } from "rsuite";


const App = ({

}) => {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting }
  } = useForm();

  function onSubmit(values) {
    console.log('vvvv', values)
    return new Promise((resolve) => {
      setTimeout(() => {
        alert(JSON.stringify(values, null, 2));
        resolve();
      }, 3000);
    });
  }


  console.log('errrr', errors)


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
                <FormControl isInvalid={!!errors.org_inn}>
                  <FormLabel fontSize="md">ИНН организации</FormLabel>
                  <Input id="org_inn" {...register("org_inn", { required: "Поле обязательное для заполнения" })} />
                  <FormErrorMessage>
                    {errors.org_inn && errors.org_inn.message}
                  </FormErrorMessage>
                </FormControl>
                <FormControl isInvalid={!!errors.person_inn} mt="1rem">
                  <FormLabel fontSize="md">ИНН физ.лица</FormLabel>
                  <Input id="person_inn" {...register("person_inn", { required: "Поле обязательное для заполнения" })} />
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
                    <option value='option1'>400074, Волгоградская обл, г Волгоград, ул Рабоче-Крестьянская, д. 30, офис 310</option>
                    <option value='option2'>344000, Ростовская обл, Ростов-на-Дону г, Лермонтовская ул, дом № 87/66, офис 404</option>
                    <option value='option3'>Курский филиал № 2 АО "АЦ" (а) Курская область, Г.О. ГОРОД КУРСК, Г КУРСК, УЛ ВАТУТИНА, Д. 25, ПОМ/КОМ 9/21</option>
                  </Select>
                  <FormErrorMessage>
                    {errors.location && errors.location.message}
                  </FormErrorMessage>
                </FormControl>
                <Checkbox style={{ margin: "1rem 0" }}>Даю согласие на обработку моих персональных данных в соответствии с <Link color='teal.500' href='#'>
                  Политикой обработки персональных данных</Link></Checkbox>
                <Textarea disabled defaultValue="Инструкция..................................................................." />
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
