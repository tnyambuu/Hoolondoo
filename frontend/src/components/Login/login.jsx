import { useForm, Controller } from 'react-hook-form';
import { Row, Col, Label, Input, Button, FormFeedback, FormGroup, Container } from 'reactstrap';
import { Link, useNavigate } from 'react-router-dom';
import './login.css';
import useApi from '../../hooks/useApi';

function Login() {
  const {
    handleSubmit,
    control,
    formState: { errors }
  } = useForm();

  const navigate = useNavigate();
  const userApi = useApi().root;

  async function onSubmit(data) {
    const responseData = await userApi.login(data);
    if (responseData.is_success) {
      navigate('/');
    }
  }

  return (
    <div className="centered-container">
      <Container className='w-full lg:w-1/4 p-2 container border border-4 rounded-lg  '>
        <form onSubmit={handleSubmit(onSubmit)} className= "">
          <Row>
            <h2 className='text-2xl'>Нэвтрэх хуудас</h2>
          </Row>
          <Row className="justify-content-start">
            <Col md={6}>
              <FormGroup>
                <Label for="exampleEmail">Email</Label>
                <Controller
                  name="email"
                  control={control}
                  defaultValue=""
                  rules={{ required: "Email is required" }}
                  render={({ field }) => (
                    <div>
                      <Input
                        id="exampleEmail"
                        placeholder="--email--"
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
                <Label for="examplePassword">Password</Label>
                <Controller
                  name="password"
                  control={control}
                  defaultValue=""
                  rules={{ required: "Password is required" }}
                  render={({ field }) => (
                    <div>
                      <Input
                        id="examplePassword"
                        placeholder="--password--"
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
          </Row>
          <Row className="justify-content-center underline hover:text-blue-500">
            {/* <button type="submit" className='button-link'>Sign in</button> */}
            <Link to='/register'>Бүртгүүлэх</Link>
          </Row>
          <Row className="justify-content-center hover:text-blue-500">
            <button type="submit" className='border rounded-md bg-blue-950 m-2 px-1 text-white hover:text-blue-500'>Sign in</button>
            {/* <Link to='/register' className='button-link'>Register</Link> */}
          </Row>
        </form>
      </Container>
    </div>
  );
}

export default Login;
