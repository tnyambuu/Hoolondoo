import { useForm, Controller } from 'react-hook-form';
import { Row, Col, Label, Input, Button, FormFeedback, FormGroup, Container } from 'reactstrap';
import { Link, useNavigate } from 'react-router-dom';
import './register.css';
import useApi from '../../hooks/useApi';

function Register() {
    const userApi = useApi().createUser
    const {
        handleSubmit,
        control,
        formState: { errors }
    } = useForm();
    const navigate = useNavigate();
    async function onSubmit(data) {
        const datas = await userApi.post(data)
        if (datas['is_success']) {
            navigate('/login')
        }
    }
    return (
        <div className="centered-container">
            <Container className="container rounded-lg  w-full lg:w-1/4 p-2 ">
                <form onSubmit={handleSubmit(onSubmit)} >
                    <Row>
                        <h2 className=''>Бүртгүүлэх</h2>
                    </Row>
                    <Row>
                        <Col md={6}>
                            <FormGroup>
                                <Label for="exampleEmail">И-мэйл</Label>
                                <Controller
                                    name="email"
                                    control={control}
                                    defaultValue=""
                                    rules={{ required: "И-мэйлээ оруулна уу" }}
                                    render={({ field }) => (
                                        <div>
                                            <Input
                                                id="exampleEmail"
                                                placeholder="--И-мэйл--"
                                                type="email"
                                                invalid={!!errors.email}
                                                {...field}
                                            />
                                            {errors.email && <FormFeedback>{errors.email.message}</FormFeedback>}
                                        </div>
                                    )}
                                />
                            </FormGroup>
                        </Col>
                        <Col md={6}>
                            <FormGroup>
                                <Label for="examplePassword">Нууц үг</Label>
                                <Controller
                                    name="password"
                                    control={control}
                                    defaultValue=""
                                    rules={{ required: "Нууц үгээ оруулна уу" }}
                                    render={({ field }) => (
                                        <div>
                                            <Input
                                                id="examplePassword"
                                                placeholder="--Нууц үг--"
                                                type="password"
                                                invalid={!!errors.password}
                                                {...field}
                                            />
                                            {errors.password && <FormFeedback>{errors.password.message}</FormFeedback>}
                                        </div>
                                    )}
                                />
                            </FormGroup>
                        </Col>
                        <Col md={6}>
                            <FormGroup>
                                <Label for="last_name">Овог</Label>
                                <Controller
                                    name="last_name"
                                    control={control}
                                    defaultValue=""
                                    rules={{ required: "Овгоо оруулна уу" }}
                                    render={({ field }) => (
                                        <div>
                                            <Input
                                                id="last_name"
                                                placeholder="--Овог--"
                                                type="last_name"
                                                invalid={!!errors.last_name}
                                                {...field}
                                            />
                                            {errors.last_name && <FormFeedback>{errors.last_name.message}</FormFeedback>}
                                        </div>
                                    )}
                                />
                            </FormGroup>
                        </Col>
                        <Col md={6}>
                            <FormGroup>
                                <Label for="first_name">Нэр</Label>
                                <Controller
                                    name="first_name"
                                    control={control}
                                    defaultValue=""
                                    rules={{ required: "Нэрээ оруулна уу" }}
                                    render={({ field }) => (
                                        <div>
                                            <Input
                                                id="first_name"
                                                placeholder="--Нэр--"
                                                type="text"
                                                invalid={!!errors.first_name}
                                                {...field}
                                            />
                                            {errors.first_name && <FormFeedback>{errors.first_name.message}</FormFeedback>}
                                        </div>
                                    )}
                                />
                            </FormGroup>
                        </Col>
                    </Row>
                    <Row>
                        <button type="submit" className='border rounded-md bg-blue-950 m-2 px-1 text-white'>Бүртгүүлэх</button>
                    </Row>
                </form>
            </Container>
        </div>
    );
}

export default Register