import React , { Component } from "react";
import {auth,signOut,database,ref,push,onValue} from '../../config/Fire';
import './Tracker.css';
import Transaction from "./Transaction/Transaction";

class Tracker extends Component {

    state = {
        transactions: [],
        money: 0,
        //added
        income: 0,
        expense: 0,

        transactionName: '',
        transactionType: '',
        price: '',
        currentUID: auth.currentUser.uid
    }

    // logout
    logout = () => {
        signOut(auth);
    }

    handleChange = input => e => {
        this.setState({
            [input]: e.target.value !=="0" ? e.target.value : ""
        });
    }

    // add transaction
    addNewTransaction = () => {
        const {
            transactionName,
            transactionType,
            price,
            currentUID,
            money,
            income,
            expense
        } = this.state;

        //validation
        if(transactionName && transactionType && price){
            const BackUpState = this.state.transactions;
            BackUpState.push({
                id: BackUpState.length+1,
                name: transactionName,
                type: transactionType,
                price: price,
                user_id: currentUID
            });

            push(ref(database,'Transactions/' + currentUID), {
                id: BackUpState.length,
                name: transactionName,
                type: transactionType,
                price: price,
                user_id: currentUID
            }).then((data) => {
                console.log('success callback');
                this.setState({
                    transactions: BackUpState,
                    money: transactionType === 'deposit' ? money + parseFloat(price) : money - parseFloat(price),
                    income: transactionType === 'deposit' ? income + parseFloat(price) : income,
                    expense: transactionType === 'expense' ? expense + parseFloat(price) : expense,
                    transactionName: '',
                    transactionType: '',
                    price: ''
                })
                }).catch((error) => {
                    //error callback
                    console.log('error', error);
                });


        }
    }

    componentWillMount(){
        const { currentUID, money, income, expense } = this.state
        let totalMoney = money;
        let totalExpense = expense;
        let totalIncome = income;
        const BackUpState = this.state.transactions;
        onValue(ref(database,'Transactions/' + currentUID), (snapshot) => {
            //console.log(snapshot);
            snapshot.forEach((childSnapshot) => {

                totalMoney =
                childSnapshot.val().type === 'deposit' ?
                parseFloat(childSnapshot.val().price) + totalMoney
                : totalMoney - parseFloat(childSnapshot.val().price);

                totalExpense =
                childSnapshot.val().type === 'expense' ?
                parseFloat(childSnapshot.val().price) + totalExpense
                : totalExpense;

                totalIncome =
                childSnapshot.val().type === 'deposit' ?
                parseFloat(childSnapshot.val().price) + totalIncome
                : totalIncome;



                BackUpState.push({
                    id: childSnapshot.val().id,
                    name: childSnapshot.val().name,
                    type: childSnapshot.val().type,
                    price: childSnapshot.val().price,
                    user_id: childSnapshot.val().user_id,
                });

            });

            this.setState({
                transactions: BackUpState,
                money: totalMoney,
                income: totalIncome,
                expense: totalExpense
            })

        }, {onlyOnce:true});
    }
    
    render(){
        var currentUser = auth.currentUser;
        return(
        <div className="trackerBlock">
            <div className="welcome">
                <span>Hi, {currentUser.displayName}!</span>
                <button className="exit" onClick={this.logout}>Exit</button>
            </div>
            <div className="row">
                <div className="totalMoney">₹{this.state.money}</div>
                <div className="totalExpense">₹{this.state.expense}</div>
                <div className="totalIncome">₹{this.state.income}</div>
            </div>

            <div className="newTransactionBlock">
                <div className="newTransaction">
                    <form>
                        <input
                            placeholder="Transaction Name"
                            type="text"
                            name="transactionName"
                            value={this.state.transactionName}
                            onChange={this.handleChange('transactionName')}
                        />
                        <div className="inputGroup">
                            <select name="type"
                                value={this.state.transactionType}
                                onChange={this.handleChange('transactionType')}>
                                <option value="0">Type</option>
                                <option value="expense">Expense</option>
                                <option value="deposit">Deposit</option>
                            </select>
                            <input
                                placeholder="Price"
                                type="text"
                                name="price"
                                value={this.state.price}
                            onChange={this.handleChange('price')}
                            />
                        </div>
                    </form>
                    <button 
                        className="addTransaction"
                        onClick={() => this.addNewTransaction()}>
                            + Add Transaction
                    </button>
                </div>
            </div>
            
            <div className="latestTransactions">
                <p>Latest Transactions</p>
                <ul>
                    {
                        Object.keys(this.state.transactions).map((id) => (
                            <Transaction key={id}
                                type={this.state.transactions[id].type}
                                name={this.state.transactions[id].name}
                                price={this.state.transactions[id].price}
                            />
                        ))
                    }
                </ul>
            </div>
        </div>
        );
    }
}

export default Tracker;