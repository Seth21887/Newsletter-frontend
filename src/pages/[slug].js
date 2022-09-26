import React, { useState } from 'react'
import { useRouter } from 'next/router'
import styles from '../styles/Detail.module.css'
import Image from 'next/image'
import Link from 'next/link'
import dateformat from 'dateformat'
import Head from 'next/head'
import {FaCheckCircle} from "react-icons/fa"

function Campaign({ data }) {
    const [isSubmitted,setIsSubmitted] = useState(false)
    const [submitting,setIsSubmitting] = useState(false)
    const [email,setEmail] = useState("")

    const handleOnSubmit = (e) => {
        e.preventDefault(); //default behavior is performing a GET request, this prevents that.

        const options ={
            method: "POST",
            body: JSON.stringify({
                email,
                campaign: data.id,
            }),

            headers: {
                'Content-Type': 'application/json'
            }
        }

        setIsSubmitting(true)

        fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/subscribe`, options).then(res=>res.json()).then(response=>{
            setIsSubmitted(true);

        }).catch(error=>console.log('error', error)).finally(()=>{
            setIsSubmitting(false)
        })

    }

    return (
        <div>
            <Head>
                <title>{data.title}</title>
                <meta name="description" content={data.description}></meta>
            </Head>

            <div className={styles.wrapper}>
                <div className={styles.main}>

                </div>
                <div className={styles.contents}>
                    <Image className={styles.img} src={"https://res.cloudinary.com/dxu0jhp5v/"+data.logo} height={120} width={120} alt="Post Banner"/>

                    <div className={styles.grid}>
                        <div className={styles.left}>
                            <h1 className={styles.title}>{data.title}</h1>
                            <p className={styles.description}>{data.description}</p>
                        </div>
                        {!isSubmitted &&
                            <div className={styles.right}>
                           <div className={styles.rightContents}>
                                <form onSubmit={handleOnSubmit}>
                                    <div className={styles.formGroup}>
                                        <input 
                                            onChange={(event)=>{
                                                setEmail(event.target.value)
                                            }}
                                            required type="email" name="email" placeholder="Enter an email" className={styles.input}/>
                                    </div>
                                    <div className={styles.submit}>
                                        <input 
                                            type="submit" name="email" 
                                            value={submitting ? "PLEASE WAIT" : "Subscribe"} 
                                            disabled={submitting} 
                                            className={styles.button}/>
                                        <p className={styles.consent}>We repsect your privacy. Unsubscribe at anytime. </p>
                                
                                    </div>
                                    
                                </form>
                            </div>
                        </div>}{isSubmitted &&<div className={styles.thankYou}>
                                        <div className={styles.icon}>
                                            <FaCheckCircle size={17} color="green" />
                                        </div>
                                        <div className={styles.message}>
                                            Thank you for your subscription.
                                        </div>

                           </div>}
                    </div>
                </div>

            </div>
        <div className={styles.item}>

            <footer className={styles.footer}>
                <Link href="/">
                    <a>Go back to list.</a>
                </Link>
            </footer>
        </div>
        </div>
    )
}

export async function getStaticPaths() {
    const response=await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/campaigns`)

    const data=await response.json()

    const allSlugs=data.map(item => item.slug)
    //map gives us the array of all the item's information, and we're choosing only the slug info for all items

    const paths = allSlugs.map(slug => ({params: { slug: slug } }))

    return {
        paths,
        fallback: false
    }

}

export async function getStaticProps({params}){
    const response=await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/campaigns/${params.slug}`)

    const data = await response.json()

    return {
        props: {
            data
        }

    }
}

export default Campaign