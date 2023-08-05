import React, { useState } from 'react';
import styles from './auto.module.css';
import OsagoForm from '../../components/UI/Forms/Osago/OsagoForm';

// Страница с формой для ОСАГО.
const Auto = () => {
  return (
    <div className='flex pb-4'>
      <div className='container'>
          <OsagoForm/>
      </div>
    </div>
  );
};

export default Auto;