import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useEffect } from 'react';
import styles from '../styles/Home.module.css'
import dateformat from 'dateformat'
import Link from 'next/link'

export default function Home({data,error}) {

  const router= useRouter()

  useEffect(()=>{
    console.log('process.env.NEXT_PUBLIC_BASE_URL :>>', process.env.NEXT_PUBLIC_BASE_URL)
  },[])

  const handleNavigation=({slug})=>{
    router.push("/" + slug)
  }

  return (
    <div>
      <Head>
        <title>Newsletters: | Home</title>
        <meta name="description" content="A site for Campaigns"/>
      </Head>
      <main className={styles.main}>
        <div className={styles.innerContent}>

        
        <h1>Available Newsletters</h1>

        {error&&<p>{JSON.stringify(error)}</p>}

        {data.map((element)=><div key={element.slug}>
          <div className={styles.item} onClick={ () => handleNavigation(element)}>
            <div className={styles.imgContainer}>
              <Image className={styles.img} src={"https://res.cloudinary.com/dxu0jhp5v/"+element.logo} height={120} width={120} alt="Post Banner"/>
            </div>
            <div className={styles.rightItems}>
              <Link href={"/"+element.slug}><a>{element.title}</a></Link>
              <p>{element.description}</p>
              <small>{dateformat(new Date(element.created_at), "dddd, mmmm, dS, yyyy, h:MM:ss TT")}</small>
            </div>
          </div>
        </div>)}
        </div>
      </main>
    </div>
  )
}

//getStaticProps runs only on server
export async function getStaticProps(){
  let data=[];
  let error = null;

  try {
    const response=await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/campaigns`)
    //adding NEXT_PUBLIC to our base url ensures that we'll be able to access it both browser and server side.

    data=await response.json()

  } catch (err) {
      console.log('err :>>', err);
      error = err.message?err.message:"something went wrong"
  }


  return {
    props:{
      data,
      error,
    }
  }
}