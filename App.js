import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import "./App.css";
import Search from "./components/Search";
import Result from "./components/Result";
import Detail from "./components/Detail";

function App() {
    const [state, setState] = useState({
        search: '',
        results: [],
        selected: {},
        loading: false
    });

    const handleInput = (e) => {
        let search = e.target.value;
        setState((prevState) => {
            return { ...prevState, search: search }
        });
    };

    const openDetail = (id) => {
        setState((prevState) => ({ ...prevState, loading: true }));
        axios.get('http://www.omdbapi.com/?i=' + id + '&apikey=6f1b164d')
            .then(({ data }) => {
                setState((prevState) => {
                    return { ...prevState, selected: data, loading: false };
                });
            })
            .catch(err => console.log(err));
    };

    const SearchResult = (e) => {
        if (e.key === "Enter") {
            setState((prevState) => ({ ...prevState, loading: true }));
            axios.get(`http://www.omdbapi.com/?apikey=6f1b164d&s=${state.search}`)
                .then(res => {
                    setState(prevState => {
                        return { ...prevState, results: res.data.Search || [], loading: false };
                    });
                })
                .catch(err => console.log(err));
        }
    };

    const clearSearch = () => {
        setState({
            search: '',
            results: [],
            selected: {},
            loading: false
        });
    };

    const close = () => {
        setState((prevState) => { return { ...prevState, selected: {} } });
    };

    return (
        <div className="main-wrapper w-100 d-flex flex-column align-items-center min-vh-100">
            {state.loading ? (
                <div className="spinner-border text-primary" role="status">
                    <span className="sr-only">Loading...</span>
                </div>
            ) : (
                typeof state.selected.Title !== "undefined" ? 
                    <Detail selected={state.selected} close={close}/> 
                    : 
                    <header className="w-100 text-center text-white mt-5">
                        <h1 className="app-title">Movie Night</h1>
                        <Search handleInput={handleInput} SearchResult={SearchResult} clearSearch={clearSearch} />
                        <div className="container">
                            <div className="row">
                                {Array.isArray(state.results) && state.results.length > 0 ? (
                                    state.results.map((result, i) => (
                                        <div className="col-12 col-sm-6 col-md-3 col-lg-3 my-2" key={i}>
                                            <Result result={result} openDetail={openDetail} />
                                        </div>
                                    ))
                                ) : (
                                    <div className="col-12">
                                        <p>No results found</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </header>
            )}
        </div>
    );
}

export default App;
