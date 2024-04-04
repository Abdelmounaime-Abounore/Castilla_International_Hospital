import React, { useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import { Formik, Form, Field, ErrorMessage, useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import styles from './login.module.scss';
import { message } from 'antd';
import { useNavigate } from 'react-router-dom';

const warning = () => {
    message.warning('L\'opération a échoué. Veuillez réessayer à nouveau');
};

const Login = () => {

    interface UserData {
        email: string;
        password: string;
    }

    const navigate = useNavigate()
    const [error, setError] = useState(null);

    const validationSchema = Yup.object().shape({
        email: Yup.string().email('* Invalid email').required('* Email is required'),
        password: Yup.string().required('* Password is required'),
    });

    const formik = useFormik({
        initialValues: {
            email: "",
            password: ""
        },
        validationSchema,
        onSubmit: async (values: UserData) => {
            try {
                await login.mutateAsync(values);
                navigate('/login');
            } catch (error) {
                console.error('Error updating company:', error);
            }
        },
    });

    const login = useMutation(
        (data: UserData) => axios.post("http://localhost:3000/auth/login", data),
        {
            onSuccess: (response) => {
                const token = response.data.token;
                localStorage.setItem('token', token);

                // message.success('Login successful');
                console.log(token);
                
            },

            onError: (error: any) => {
                setError(error); 
                warning()
            },
        }
    );

    return (
        <section className={styles.loginSection}>
            <div className="flex flex-col items-center justify-center h-screen w-3/5">
                <div className="w-full max-w-md bg-white rounded-lg shadow p-6 dark:bg-gray-800 dark:border-gray-700">
                    <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white pb-6">
                        Login
                    </h1>
                    {/* <pre style={{ color: 'black' }}>formik: {JSON.stringify(formik.dirty, null, 2)}</pre>
                    <pre style={{ color: 'black' }}>values: {JSON.stringify(formik.values, null, 2)}</pre>
                    <pre style={{ color: 'black' }}>errors: {JSON.stringify(formik.errors, null, 2)}</pre> */}
                    <form className="space-y-4 md:space-y-6" onSubmit={formik.handleSubmit}>
                        <div className="flex-grow">
                            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white text-left">Email <span className='text-red-600'>*</span> </label>
                            <input
                                type="email"
                                name="email"
                                id="email"
                                className="bg-gray-50 border focus:outline-none border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                placeholder="Email"
                                value={formik.values.email}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                            {formik.touched.email && formik.errors.email && (
                                <div className={styles.error}>{formik.errors.email}</div>
                            )}
                        </div>
                        <div className="flex-grow">
                            <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white text-left">Password <span className='text-red-600'>*</span> </label>
                            <input
                                type="password"
                                name="password"
                                id="password"
                                className="bg-gray-50 focus:outline-none border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                placeholder="Password"
                                value={formik.values.password}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}

                            />
                            {formik.touched.password && formik.errors.password && (
                                <div className={styles.error}>{formik.errors.password}</div>
                            )}
                        </div>
                        <div className="flex justify-between items-center pt-5">
                            <button
                                type="submit"
                                // disabled={isSubmitting}
                                className="text-white bg-purple-900 hover:bg-purple-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                            // onClick={() => formik.handleSubmit()}
                            >
                                {/* {isSubmitting ? 'Submitting...' : 'Register'} */}
                                Login
                            </button>
                            <p className="text-sm text-left font-light text-gray-500 dark:text-gray-400">
                                Créer nouveau compte ? <a href="/register" className="font-medium text-purple-900 hover:underline dark:text-primary-500">Register</a>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default Login;