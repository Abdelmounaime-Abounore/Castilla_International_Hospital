import React, { useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import { Formik, Form, Field, ErrorMessage, useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import styles from './register.module.scss';
import { message } from 'antd';
import { useNavigate } from 'react-router-dom';


const Register = () => {
  const navigate = useNavigate()
  interface UserData {
    name: string;
    email: string;
    phoneNumber: string;
    password: string;
    confirmPassword: string;
    roleId: undefined;
    speciality: string;
    image: string;
  }

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('* Name is required'),
    phoneNumber: Yup.string().required('* Phone Number is required'),
    email: Yup.string().email('* Invalid email').required('* Email is required'),
    password: Yup.string().required('* Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], '* Passwords must match')
      .required('* Confirm Password is required'),
    roleId: Yup.string().required('* Role is required'),
  });

  const formik = useFormik({
    initialValues: {
      name: '',
      phoneNumber: '',
      email: '',
      password: '',
      confirmPassword: '',
      roleId: "",
      image: "",
      specialityId: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        console.log('Submitting form with values:', values);
        await mutation.mutateAsync(values);
      } catch (error) {
        console.error('Error:', error);
      }
    },
  });

  const mutation = useMutation(
    (data: UserData) => axios.post('http://localhost:3000/auth/register', data),
    {
      onSuccess: (response) => {
        const { data } = response;
        // if (data && data.success) {
        navigate('/login');
        message.success("Register successful, please verify your Email");
        // }
      },
      onError: (error) => {
        if (error.response && error.response.data && error.response.data.error) {
          message.error(error.response.data.error); // Display error message from backend
        } else {
          console.error(error); // Log the error for debugging
          message.error('An error occurred during registration'); // Display generic error message
        }
      },
    }
  );

  const [showSpecialityInput, setShowSpecialityInput] = useState<boolean>(false);

  const fetchRoles = async () => {
    const response = await axios.get('http://localhost:3000/roles');

    return response.data;
  };

  const fetchSpecialities = async () => {
    const response = await axios.get('http://localhost:3000/speciality');

    return response.data;
  };

  const { data: roles = [], isError: isRoleeError } = useQuery('roles', fetchRoles);
  const { data: specialities = [], isError: isSpecialityError } = useQuery('specialities', fetchSpecialities);

  const handleRoleChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedRoleId = event.target.value;

    formik.setValues({
      ...formik.values,
      roleId: selectedRoleId,
    });

    try {
      const response = await axios.get(`http://localhost:3000/roles/${selectedRoleId}`);
      const fetchedRole = response.data;
      if (fetchedRole.roleName === 'Medecin') {
        setShowSpecialityInput(true);
      } else {
        setShowSpecialityInput(false);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleSpecialityChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedSpecialityId = event.target.value;

    formik.setValues({
      ...formik.values,
      specialityId: selectedSpecialityId,
    });
  };
  return (
    <section className={styles.registerSection}>
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="w-full max-w-md bg-white rounded-lg shadow p-6 dark:bg-gray-800 dark:border-gray-700">
          <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white pb-6">
            Create an account
          </h1>
          {/* <pre style={{ color: 'black' }}>formik: {JSON.stringify(formik.dirty, null, 2)}</pre>
          <pre style={{ color: 'black' }}>values: {JSON.stringify(formik.values, null, 2)}</pre>
          <pre style={{ color: 'black' }}>errors: {JSON.stringify(formik.errors, null, 2)}</pre> */}
          <form className="space-y-4 md:space-y-6" onSubmit={formik.handleSubmit}>
            <div className="flex-grow">
              <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white text-left">User Name <span className='text-red-600'>*</span> </label>
              <input
                type="text"
                id="name"
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:outline-none focus:ring-primary-600 focus:border-primary-600 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Name"
                name='name'
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}

              />
              {formik.touched.name && formik.errors.name && (
                <div className={styles.error}>{formik.errors.name}</div>
              )}
            </div>
            <div className="flex space-x-4">
              <div className="flex-grow">
                <label htmlFor="phoneNumber" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white text-left">Phone Number <span className='text-red-600'>*</span> </label>
                <input
                  type="text"
                  name="phoneNumber"
                  id="phoneNumber"
                  className="bg-gray-50 focus:outline-none border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Phone Number"
                  value={formik.values.phoneNumber}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.phoneNumber && formik.errors.phoneNumber && (
                  <div className={styles.error}>{formik.errors.phoneNumber}</div>
                )}
              </div>
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
            </div>
            <div className="flex space-x-4">
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
              <div className="flex-grow">
                <label htmlFor="confirmPassword" className="block focus:outline-none mb-2 text-sm font-medium text-gray-900 dark:text-white text-left">Confirm Password * </label>
                <input
                  type="password"
                  id="confirmPassword"
                  className="bg-gray-50 border border-gray-300 text-gray-900  focus:outline-none sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Confirm Password"
                  name="confirmPassword"
                  value={formik.values.confirmPassword}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                  <div className={styles.error}>{formik.errors.confirmPassword}</div>
                )}
              </div>
            </div>
            <div className="flex space-x-4">
              <div>
                <label htmlFor="roleId" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white text-left">Select Role <span className='text-red-600'>*</span> </label>
                <select
                  name="roleId"
                  value={formik.values.roleId}
                  className="bg-gray-50 border border-gray-300 text-gray-900  focus:outline-none sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  onChange={handleRoleChange}
                >
                  <option value="">Register as ..</option>
                  {roles.map((role) => (
                    <option key={role._id} value={role._id}>
                      {role.roleName}
                    </option>
                  ))}
                </select>

                {formik.touched.roleId && formik.errors.roleId && (
                  <div className={styles.error}>{formik.errors.roleId}</div>
                )}
              </div>
              <div>
                <label htmlFor="image" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white text-left">Profile Image</label>
                <input
                  type="text"
                  name="image"
                  id="image"
                  className="bg-gray-50 focus:outline-none border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Profile Image"
                  value={formik.values.image}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.image && formik.errors.image && (
                  <div className={styles.error}>{formik.errors.image}</div>
                )}
              </div>
            </div>
            {showSpecialityInput && (
              <div className='flex-grow'>
                <label htmlFor="specialityId" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white text-left">Select Your Speciality<span className='text-red-600'>*</span> </label>
                <select
                  name="specialityId"
                  value={formik.values.specialityId}
                  className="bg-gray-50 border border-gray-300 text-gray-900  focus:outline-none sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  onChange={handleSpecialityChange}
                >
                  <option value="">Select Your Speciality ..</option>
                  {specialities.map((speciality) => (
                    <option key={speciality._id} value={speciality._id}>
                      {speciality.name}
                    </option>
                  ))}
                </select>
                {formik.touched.specialityId && formik.errors.specialityId && (
                  <div className={styles.error}>{formik.errors.specialityId}</div>
                )}
              </div>
            )}
            <div className="flex justify-between items-center">
              <button
                type="submit"
                // disabled={isSubmitting}
                className="text-white bg-purple-900 hover:bg-purple-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
              // onClick={() => formik.handleSubmit()}
              >
                {/* {isSubmitting ? 'Submitting...' : 'Register'} */}
                Register
              </button>
              <p className="text-sm text-left font-light text-gray-500 dark:text-gray-400">
                Already have an account? <a href="/login" className="font-medium text-purple-900 hover:underline dark:text-primary-500">Login here</a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Register;