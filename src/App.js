import './App.css';
import styled from 'styled-components'
import { useState } from 'react';
import axios from 'axios'
import { useEffect } from 'react';

const MainView = styled.div`
  display: flex;
  flex-direction: column;
  margin: 20px;
`

const SplitView = styled.div`
  display: flex;
  flex-direction: row;
`

const SelectorDiv = styled.div`
  background-color: #c9d0dd;
  width: 400px;
  height: 60px;
  display: flex;
  flex-direction: row;
  border-radius: 10px;
  padding-left: 10px;
  padding-right: 10px;
`
const DropdownDiv = styled.div`
  width: 200px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const BalanceDiv = styled.div`
  display: flex;
  flex-direction: column;
  width: 50%;
  align-items: flex-end;
  justify-content: center;
`

const BalanceTxt = styled.p`
  color: blue;
  margin: 0;
  font-size: 13px;
`

const Text = styled.p`
  margin: 0;
  font-size: 16px
`

const Input = styled.input`
  width: 98%;
  border-radius: 10px;
  margin-top: 20px;
  margin-bottom: 20px;
  height: 40px;
`

const Button = styled.button`
  background-color: #5580E0;
  width: 100%;
  border-radius: 10px;
  border-width: 0px;
  color: white;
`
const RightDiv = styled.div`
  display: flex;
  flex-direction: column;
  width: 400px;
  height: 340px;
  background-color: #5580E0;
  margin-left: 20px;
  border-radius: 10px;
  justify-content: center;
  align-items: center;
`

const ConversionTxt = styled.p`
  color: white;
  margin-bottom: 10px;
  font-weight: bold;
  font-size: 14px;
`

const DropdownBox = styled.div`
  width: 250px;
  height: auto;
  position: absolute;
  top: 130px;
  background-color: white;
  border-color: grey;
  border-width: 1px;
  border-radius: 10px;
`
const DropdownItem = styled.div`
  margin-top: 5px;
  margin-bottom: 5px;
  cursor: pointer;
  padding-left: 20px;
`

const Error = styled.p`
  color: red;
  font-size: 13px;
  margin-top: 0;
`

function App() {
  const currencyList = [
      {currency: 'USD', balance:5000},
      {currency: 'GBP', balance:2000},
      {currency: 'EUR', balance:3500},
      {currency: 'NGN', balance:200000},
  ]

  const [selectedCurrencyFrom, setSelectedCurrencyFrom] = useState(currencyList[0])
  const [selectedCurrencyTo, setSelectedCurrencyTo] = useState()
  const [showFromDropdown, setShowFromDropdown] = useState(false)
  const [showToDropdown, setShowToDropdown] = useState(false)
  const [rates, setRates] = useState()
  const [convertVal, setConvertVal] = useState(0)
  const [convertedVal, setConvertedVal] = useState(0)
  const [error, setError] = useState('')
  const [details, setDetails] = useState(false)

  useEffect(() => {
    const exchangeCurrency = () => {
      axios.get(`https://api.exchangerate-api.com/v4/latest/${selectedCurrencyFrom?.currency}`).then(res => {
        if(res.status === 200){
          setRates(res.data?.rates)
        }
      })
    }
    selectedCurrencyFrom?.currency && exchangeCurrency()
  }, [selectedCurrencyFrom])

  useEffect(() => {
    if (parseInt(convertVal) === 'NaN') return
    if(parseInt(convertVal) > selectedCurrencyFrom?.balance) {
      setError('The amount entered exceeds the account balance')
      return
    }
    if(selectedCurrencyTo && selectedCurrencyTo?.currency in rates){
      setConvertedVal(convertVal * rates[selectedCurrencyTo.currency])
    }
  }, [convertVal, selectedCurrencyTo, selectedCurrencyFrom])
  
  return (
    <MainView>
    <h3>Convert from one to another currency</h3>
    <SplitView>
      <div>
      <SelectorDiv>
        <DropdownDiv>
          <p>{selectedCurrencyFrom?.currency || currencyList[0].currency}</p> 
          <div onClick={() => setShowFromDropdown(!showFromDropdown)}>
            <p>Icon</p>
          </div> 
          {showFromDropdown && <DropdownBox>
            {currencyList.map((item) => (
              <div onClick={() => {
                setShowFromDropdown(false)
                setSelectedCurrencyFrom(item)
              }}>
                <DropdownItem><p>{item.currency}</p></DropdownItem>
              </div>
            ))}
          </DropdownBox>}
        </DropdownDiv>
        <BalanceDiv>
          <BalanceTxt>Balance</BalanceTxt>
          <Text>{selectedCurrencyFrom?.balance || currencyList[0].balance}</Text>
        </BalanceDiv>
      </SelectorDiv>

      <Input onChange={(e) => setConvertVal(e.target.value)} />
      {!!error && (
        <Error>
          {error}
        </Error>
      )}

      <SelectorDiv>
        <DropdownDiv>
          <p>{selectedCurrencyTo?.currency || 'Convert to'}</p> 
          <div onClick={() => setShowToDropdown(!showToDropdown)}>
            <p>Icon</p>
          </div> 
          {showToDropdown && <DropdownBox>
            {currencyList.filter(item => item.currency !== selectedCurrencyFrom?.currency).map((item) => (
              <div onClick={() => {
                setShowToDropdown(false)
                setSelectedCurrencyTo(item)
              }}>
                <DropdownItem><p>{item.currency}</p></DropdownItem>
              </div>
            ))}
          </DropdownBox>}
        </DropdownDiv>
        <BalanceDiv>
          <BalanceTxt>Balance</BalanceTxt>
          <Text>{selectedCurrencyTo?.balance || '$0'}</Text>
        </BalanceDiv>
      </SelectorDiv>
      
        <Input value={convertedVal} readOnly />
      
        <Button onClick={() => {
          setDetails(true)
        }}>
          <p>Convert</p>
        </Button>
      </div>
      <RightDiv>
        <ConversionTxt>You're converting: {details ? convertVal : '$0'}</ConversionTxt>
        <ConversionTxt>You'll get: {details ? convertedVal : '$0'}</ConversionTxt>
        <ConversionTxt>Source: {details && selectedCurrencyFrom.currency}</ConversionTxt>
      </RightDiv>
    </SplitView>
    </MainView>
  );
}

export default App;
