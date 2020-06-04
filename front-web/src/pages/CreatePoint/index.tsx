import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import logo from '../../assets/logo.svg';
import './styles.css';

const CreatePoint = () => {
  return (
    <div id="page-create-point">
      <header>
        <img src={logo} alt="eColeta" />
        <Link to="/">
          <FiArrowLeft></FiArrowLeft>
          Voltar para home
        </Link>
      </header>
      <main>
        <h1>Create Point Component !</h1>
      </main>
    </div>
  )
}

export default CreatePoint;