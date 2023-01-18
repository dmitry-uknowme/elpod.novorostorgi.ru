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
  Link, Checkbox
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
              {/* <Divider /> */}
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
                    <option value='option1'>Локация 1</option>
                    <option value='option2'>Локация 2</option>
                    <option value='option3'>Локация 3</option>
                  </Select>
                  <FormErrorMessage>
                    {errors.location && errors.location.message}
                  </FormErrorMessage>
                </FormControl>
                <Checkbox style={{ marginTop: "1rem" }}>Даю согласие на обработку моих персональных данных в соответствии с <Link color='teal.500' href='#'>
                  Политикой обработки персональных данных</Link></Checkbox>
                <Button mt="2rem" colorScheme="blue" isLoading={isSubmitting} type="submit">
                  Отправить
                </Button>
              </Card>
            </form >
          </Box>
        </div>

      </div>

    </Box >
    // <form onSubmit={handleSubmit(onSubmit)}>
    //   <FormControl isInvalid={true}>
    //     <FormLabel htmlFor="name">First name</FormLabel>
    //     <Input
    //       id="name"
    //       placeholder="name"
    //       {...register("name", {
    //         required: "This is required",
    //         minLength: { value: 4, message: "Minimum length should be 4" }
    //       })}
    //     />
    //     <FormErrorMessage>
    //       {errors.name && errors.name.message}
    //     </FormErrorMessage>
    //   </FormControl>
    //   <Button mt={4} colorScheme="teal" isLoading={isSubmitting} type="submit">
    //     Submit
    //   </Button>
    // </form>
    // <>
    //   <h2 className="text-center">Заявка на получение электронной подписи</h2>
    //   <form onSubmit={submitHandler}>
    //     <div className="row justify-content-center">
    //       {/*<form>*/}
    //       {serverResponse ? (
    //         <div className="d-flex justify-content-center text-center">
    //           {serverResponse}
    //         </div>
    //       ) : isFetching ? (
    //         <Loader />
    //       ) : (
    //         <div className="row justify-content-center">
    //           {/*{sections.map((section) => (*/}
    //           <div className="col-md-10">
    //             <h6 className="text-center">
    //               Чтобы приступить к оформлению электронной подписи в
    //               партнерском Удостоверяющем центре, заполните поля информации
    //               в форме ниже
    //             </h6>
    //             <div className="col-lg-8 offset-lg-2 col-md-12 mt-4">
    //               <div className="form-group">
    //                 <input
    //                   className="form-control"
    //                   name="name"
    //                   placeholder="ИНН Организации (ИП, ООО)"
    //                   value={formData.organization_id}
    //                   required
    //                   onChange={(e) =>
    //                     setFormData((state) => ({
    //                       ...state,
    //                       organization_id: e.target.value,
    //                     }))
    //                   }
    //                 />
    //               </div>
    //               <div className="form-group mt-3">
    //                 {/*<label htmlFor='email'>Email адрес в системе</label>*/}
    //                 <input
    //                   className="form-control"
    //                   name="name"
    //                   placeholder="ИНН физ. лица (руководителя организации)"
    //                   value={formData.person_id}
    //                   required
    //                   onChange={(e) =>
    //                     setFormData((state) => ({
    //                       ...state,
    //                       person_id: e.target.value,
    //                     }))
    //                   }
    //                 />
    //               </div>
    //               <div className="form-group mt-3">
    //                 {/*<label htmlFor='email'>Email адрес в системе</label>*/}
    //                 <input
    //                   className="form-control"
    //                   name="name"
    //                   placeholder="Фамилия Имя Отчество"
    //                   value={formData.person_name}
    //                   required
    //                   onChange={(e) =>
    //                     setFormData((state) => ({
    //                       ...state,
    //                       person_name: e.target.value,
    //                     }))
    //                   }
    //                 />
    //               </div>
    //               <div className="form-group mt-3">
    //                 {/*<label htmlFor='email'>Email адрес в системе</label>*/}
    //                 <input
    //                   className="form-control"
    //                   name="phone"
    //                   placeholder="Контактный номер телефона"
    //                   value={formData.person_phone}
    //                   required
    //                   onChange={(e) =>
    //                     setFormData((state) => ({
    //                       ...state,
    //                       person_phone: e.target.value,
    //                     }))
    //                   }
    //                 />
    //               </div>
    //               <div className="form-group mt-3">
    //                 {/*<label htmlFor='email'>Email адрес в системе</label>*/}
    //                 <input
    //                   className="form-control"
    //                   name="phone"
    //                   type="email"
    //                   placeholder="Адрес электронной почты"
    //                   value={formData.person_email}
    //                   required
    //                   onChange={(e) =>
    //                     setFormData((state) => ({
    //                       ...state,
    //                       person_email: e.target.value,
    //                     }))
    //                   }
    //                 />
    //               </div>
    //               {/* <div className="form-group mt-3">
    //                 <input
    //                   className="form-control"
    //                   name="phone"
    //                   placeholder="Паспортные данные (серия, номер, дата выдачи, кем выдан )"
    //                   value={formData.person_passport}
    //                   required
    //                   onChange={(e) =>
    //                     setFormData((state) => ({
    //                       ...state,
    //                       person_passport: e.target.value,
    //                     }))
    //                   }
    //                 />
    //               </div> */}
    //               <div className="form-check mt-3">
    //                 <input
    //                   className="form-check-input"
    //                   type="checkbox"
    //                   name="status_accreditation"
    //                   value="not_accredited"
    //                   required
    //                 // onChange={inputHandler}
    //                 // checked={formData.find((field) => field.name === 'status_accreditation').value === 'not_accredited'} /* checked={(e) => formData.find((field) => field)} onChange={inputHandler} */
    //                 />
    //                 <label
    //                   className="form-check-label text-muted"
    //                   htmlFor="status_accreditation"
    //                   style={{ fontSize: "0.65rem" }}
    //                 >
    //                   Даю согласие на обработку моих персональных данных в
    //                   соответствии с{" "}
    //                   <a
    //                     href="/files/Политика обработки персональных данных.pdf"
    //                     target="_blank"
    //                   >
    //                     <u
    //                       className="text-primary"
    //                       style={{ cursor: "pointer" }}
    //                     >
    //                       Политикой обработки персональных данных
    //                     </u>
    //                   </a>
    //                 </label>
    //               </div>
    //               <div className="d-flex justify-content-center mt-3 mb-5">
    //                 <button className="btn btn-primary w-100 d-flex justify-content-center">
    //                   Отправить заявку
    //                 </button>
    //               </div>
    //             </div>
    //           </div>
    //         </div>
    //       )}
    //       {/*</form>*/}
    //     </div>
    //   </form>
    // </>
  );
};

export default App;
