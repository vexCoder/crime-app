import { Box, HStack, Text, VStack } from '@chakra-ui/layout';
import {Button} from '@chakra-ui/button';
import { Fade, Slide } from '@chakra-ui/transition';
import { Input } from '@chakra-ui/react';
import React from 'react';
import useAuthGuard from '../hooks/useAuthGuard';
import { AnimatePresence, motion } from 'framer-motion';
import { useLoginMutation, useRegisterMutation, UserType } from '../generated/graphql';
import { useSetState } from 'react-use';
import { extractError } from '../utils/helper';
import { useToast } from '../providers/Toast';
import { useHistory } from 'react-router';
import constants from '../utils/constants';
import { useLocalStorageContext } from '../providers/LocalStorage';
import { useApolloContext } from '../providers/Apollo';

const Auth = () => {
  const {refetch} = useAuthGuard()
  const { setKeyValue } = useLocalStorageContext();
  const {} = useApolloContext()
  const [isLogin, setIsLogin] = React.useState(true)
  const history = useHistory()
  const toast = useToast()
  const [login, resLogin] = useLoginMutation()
  const [register, resRegister] = useRegisterMutation()

  const [loginOptions, setLogin] = useSetState({
    email: 'admin.responder@g.c',
    password: 'adminadmin'
  })
  const [registerOptions, setRegister] = useSetState({
    name: '',
    email: '',
    password: '',
  })

  const handleLogin = async () => {
    const res = await login({
      variables: {
        options: loginOptions
      }
    })

    const token = res?.data?.loginResponder?.token
    const user = res?.data?.loginResponder?.user
    const err = extractError(res, 'loginResponder')
    if(err){
      toast.error(err)
    }else{
      if(token && user) {
        toast.success('Successfully Logged-in!')
        if(user.type === UserType.Responder) {
          history.push(constants.ROUTES.DASHBOARD)
        }else if(user.type === UserType.Admin){
          history.push(constants.ROUTES.ADMIN)
        }
        setKeyValue({token})
        refetch()
      }else{
        toast.error('Login Failed')
      }
    }

    // setLogin({
    //   email: '',
    //   password: ''
    // })
  }

  const handleRegister = async () => {
    const res = await register({
      variables: {
        options: registerOptions
      }
    })

    const err = extractError(res, 'registerResponder')
    if(err){
      toast.error(err)
    }else{
      console.log(registerOptions)
      const res = await login({
        variables: {
          options: {
            email: registerOptions.email,
            password: registerOptions.password,
          }
        }
      })

      const token = res?.data?.loginResponder?.token
      if(token) {
        toast.success('Successfully Registered!')
        history.push(constants.ROUTES.DASHBOARD)
        setKeyValue({token})
        refetch()
      }else{
        toast.error('Login Failed')
      }
    }

    setRegister({
      name: '',
      email: '',
      password: '',
    })
  }

  return (
    <Box display='flex' justifyContent='center' alignItems='center' w='100vw' h='100vh'>
      <VStack position='relative' py='1' px='8' borderWidth='1px' borderStyle='solid' borderColor='gray.200' borderRadius='md' minW='350px' pb='2em'>
        <Text px='2' w='100%' textAlign='left' color='gray.400' lineHeight='1em' fontWeight={700} fontSize='2xl' mt='1em'>Alisto Responder Dashboard</Text>
        <Box  pb='1' px='2' overflow='hidden' w='100%' >
          <AnimatePresence exitBeforeEnter initial={false}>
            {isLogin && <motion.div
              key='login-state'
              style={{width: '100%', marginTop: '2em'}}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
            >
              <VStack spacing='7' >
                <VStack spacing='2' w='100%'>
                  <Text w='100%' textAlign='left' lineHeight='1em' fontWeight={700}>Email</Text>
                  <Input value={loginOptions.email} onChange={evt => setLogin({email: evt.target.value})}/>
                </VStack>
                <VStack spacing='2' w='100%'>
                  <Text w='100%' textAlign='left' lineHeight='1em' fontWeight={700}>Password</Text>
                  <Input type='password' value={loginOptions.password} onChange={evt => setLogin({password: evt.target.value})}/>
                </VStack>
                <VStack spacing='2' w='100%'>
                  <Button w='100%' onClick={handleLogin}>
                    Login
                  </Button>
                </VStack>
              </VStack>
            </motion.div>}
            {!isLogin && <motion.div
              key='register-state'
              style={{width: '100%', marginTop: '2em'}}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
            >
              <VStack spacing='7' >
                <VStack spacing='2' w='100%'>
                  <Text w='100%' textAlign='left' lineHeight='1em' fontWeight={700}>Name</Text>
                  <Input value={registerOptions.name} onChange={evt => setRegister({name: evt.target.value})}/>
                </VStack>
                <VStack spacing='2' w='100%'>
                  <Text w='100%' textAlign='left' lineHeight='1em' fontWeight={700}>Email</Text>
                  <Input value={registerOptions.email} onChange={evt => setRegister({email: evt.target.value})}/>
                </VStack>
                <VStack spacing='2' w='100%'>
                  <Text w='100%' textAlign='left' lineHeight='1em' fontWeight={700}>Password</Text>
                  <Input type='password' value={registerOptions.password} onChange={evt => setRegister({password: evt.target.value})}/>
                </VStack>
                <VStack spacing='2' w='100%'>
                  <Button w='100%' onClick={handleRegister}>
                    Register
                  </Button>
                </VStack>
              </VStack>
            </motion.div>}
          </AnimatePresence>
        </Box>
        <Text zIndex={100} cursor='pointer' color='gray.400' lineHeight='1em' fontWeight={700} fontSize='xs' pt='1em' onClick={() => setIsLogin(prev => !prev)}>
          {isLogin && 'Register Now!'}
          {!isLogin && 'Have an account?'}
        </Text>
      </VStack>
    </Box>
  );
}

export default Auth;
