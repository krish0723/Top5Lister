import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import ResponsiveAppBar from '../components/AppBar.tsx';
import ProductCard from '../components/ProductCard.tsx';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';


const Home: NextPage = () => {
  return (
    <Container maxWidth={false}>
      <ResponsiveAppBar/>
        <ProductCard/>
    </Container>
  )
}

export default Home;
