import { useState } from "react";
import axios from 'axios'
import Form from 'react-bootstrap/Form'


const SignatureRequestModal = ({

}) => {
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [serverResponse, setServerResponse] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    person_id: "",
    person_name: "",
    person_phone: "",
    person_email: "",
    person_passport: "",
    organization_id: "",
  });
  const submitHandler = async (e) => {
    e.preventDefault();
    setIsFetching(true);
    if (
      formData.person_id.trim() === "" ||
      formData.person_name.trim() === "" ||
      formData.person_phone.trim() === "" ||
      formData.person_email.trim() === "" ||
      formData.person_passport.trim() === "" ||
      formData.organization_id.trim() === ""
    ) {
      setIsFetching(false);
      setServerResponse("Не все поля формы заполнены");
      return setTimeout(() => {
        setServerResponse(null);
      }, 2500);
    }

    axios
      .post(
        `/api/callback-requests`,
        {
          ...formData,
          body: `(Подпись) ИНН организации: ${formData.organization_id}, ИНН физ. лица: ${formData.person_id}, Email: ${formData.person_email}, Паспорт: ${formData.person_passport}`,
        },
        {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        if (res.data.statusText === "success") {
          setTimeout(() => {
            setIsFetching(false);
            setServerResponse(
              "Заявка успешно отправлена. Ожидайте звонка в ближайшее рабочее время"
            );
          }, 500);
        } else {
          setTimeout(() => {
            setIsFetching(false);
            setServerResponse(
              "Произошла непредвиденная ошибка при отправке заявки. Пожалуйста попробуйте позже"
            );
          }, 500);
        }
      })
      .catch((error) =>
        setTimeout(() => {
          setIsFetching(false);
          setServerResponse(
            "Произошла непредвиденная ошибка при отправке заявки. Пожалуйста попробуйте позже"
          );
        }, 500)
      );

    await setTimeout(() => {
      setFormData({
        person_id: "",
        person_name: "",
        person_phone: "",
        person_email: "",
        person_passport: "",
        organization_id: "",
      });
    }, 5000);
    await setTimeout(() => {
      setServerResponse(null);
    }, 5200);
  };

  return (

    <>
      <h2 className="text-center">Заявка на получение электронной подписи</h2>
      <form onSubmit={submitHandler}>
        <div className="row justify-content-center">
          {/*<form>*/}
          {serverResponse ? (
            <div className="d-flex justify-content-center text-center">
              {serverResponse}
            </div>
          ) : isFetching ? (
            <Loader />
          ) : (
            <div className="row justify-content-center">
              {/*{sections.map((section) => (*/}
              <div className="col-md-10">
                <h6 className="text-center">
                  Чтобы приступить к оформлению электронной подписи в
                  партнерском Удостоверяющем центре, заполните поля информации
                  в форме ниже
                </h6>
                <div className="col-lg-8 offset-lg-2 col-md-12 mt-4">
                  <div className="form-group">
                    <input
                      className="form-control"
                      name="name"
                      placeholder="ИНН Организации (ИП, ООО)"
                      value={formData.organization_id}
                      required
                      onChange={(e) =>
                        setFormData((state) => ({
                          ...state,
                          organization_id: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="form-group mt-3">
                    {/*<label htmlFor='email'>Email адрес в системе</label>*/}
                    <input
                      className="form-control"
                      name="name"
                      placeholder="ИНН физ. лица (руководителя организации)"
                      value={formData.person_id}
                      required
                      onChange={(e) =>
                        setFormData((state) => ({
                          ...state,
                          person_id: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="form-group mt-3">
                    {/*<label htmlFor='email'>Email адрес в системе</label>*/}
                    <input
                      className="form-control"
                      name="name"
                      placeholder="Фамилия Имя Отчество"
                      value={formData.person_name}
                      required
                      onChange={(e) =>
                        setFormData((state) => ({
                          ...state,
                          person_name: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="form-group mt-3">
                    {/*<label htmlFor='email'>Email адрес в системе</label>*/}
                    <input
                      className="form-control"
                      name="phone"
                      placeholder="Контактный номер телефона"
                      value={formData.person_phone}
                      required
                      onChange={(e) =>
                        setFormData((state) => ({
                          ...state,
                          person_phone: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="form-group mt-3">
                    {/*<label htmlFor='email'>Email адрес в системе</label>*/}
                    <input
                      className="form-control"
                      name="phone"
                      type="email"
                      placeholder="Адрес электронной почты"
                      value={formData.person_email}
                      required
                      onChange={(e) =>
                        setFormData((state) => ({
                          ...state,
                          person_email: e.target.value,
                        }))
                      }
                    />
                  </div>
                  {/* <div className="form-group mt-3">
                    <input
                      className="form-control"
                      name="phone"
                      placeholder="Паспортные данные (серия, номер, дата выдачи, кем выдан )"
                      value={formData.person_passport}
                      required
                      onChange={(e) =>
                        setFormData((state) => ({
                          ...state,
                          person_passport: e.target.value,
                        }))
                      }
                    />
                  </div> */}
                  <div className="form-check mt-3">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      name="status_accreditation"
                      value="not_accredited"
                      required
                    // onChange={inputHandler}
                    // checked={formData.find((field) => field.name === 'status_accreditation').value === 'not_accredited'} /* checked={(e) => formData.find((field) => field)} onChange={inputHandler} */
                    />
                    <label
                      className="form-check-label text-muted"
                      htmlFor="status_accreditation"
                      style={{ fontSize: "0.65rem" }}
                    >
                      Даю согласие на обработку моих персональных данных в
                      соответствии с{" "}
                      <a
                        href="/files/Политика обработки персональных данных.pdf"
                        target="_blank"
                      >
                        <u
                          className="text-primary"
                          style={{ cursor: "pointer" }}
                        >
                          Политикой обработки персональных данных
                        </u>
                      </a>
                    </label>
                  </div>
                  <div className="d-flex justify-content-center mt-3 mb-5">
                    <button className="btn btn-primary w-100 d-flex justify-content-center">
                      Отправить заявку
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          {/*</form>*/}
        </div>
      </form>
    </>
  );
};

export default SignatureRequestModal;
