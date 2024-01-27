import { useEffect, useState, useContext, useCallback } from 'react'
import Banner from './Banner'
import MovieCard from './MovieCard'
import Shimmer from './Shimmer'

import { SearchContext } from './Search'


const Home = () => {
    let { q, o } = useContext(SearchContext);
    let { setOgData, ogData } = o;
    let [movieData, setMovieData] = useState(ogData);
    let [displayData, setDisplayData] = useState([]);
    
    let { query ,setQuery } = q;


    useEffect(() => {
        let filteredArray = movieData.filter((obj) => {
            return obj.title.toLowerCase().includes(query.toLowerCase())
        })
        setDisplayData(filteredArray);
      
    }, [movieData, query])

    // console.log(query);

    let getData = (pageno) => {


        const options = {
            method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzZDAyOGQxYmQzYzYwNDliMTNjMGFiNmM2ZmRjM2NkZCIsInN1YiI6IjY1OWU4Yjc2MjRiMzMzMDIwMDM0MWViMCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Chmx9coN_IFHUsvLdTP66XJliib-sqNM9Uqh-nQjD5s'
            }
        };

        fetch(`https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=${pageno}`, options)
            .then(response => response.json())
            .then((response) => {

                setMovieData([...response.results])
                 setDisplayData([...response.results])
                setOgData([...response.results]);
                
            }).catch(err => console.error(err));
    };

    

    useEffect(() => {
        getData(1);
    }, [])

    // eslint-disable-next-line react-hooks/exhaustive-deps
    let myfilter = useCallback((logicFunction) => {
        let filteredArray = movieData.filter(logicFunction)
        setDisplayData(filteredArray);
    })

    let findTopRated = () => {
        function abc(obj) {
            return obj.vote_average > 8;
        }

        myfilter(abc);
    }

    let findLowrated = useCallback(() => {
        function abc(obj) {
            return obj.vote_average < 6;
        }

        myfilter(abc);
    },[myfilter])

    let findPopular = () => {
        function abc(obj) {
            return obj.popularity > 1000;
        }

        myfilter(abc);
    }

    let findVote = () => {
        function abc(obj) {
            return obj.vote_count > 700;
        }

        myfilter(abc);
    }

    if (movieData.length == 0) {
        return <Shimmer></Shimmer>
    }

    return (
        <div className="bg-gradient-to-b from-indigo-500 via-purple-500 to-pink-500" >
            <div className="banner min-h-screen-1/2">
                <Banner></Banner>
            </div>

            <div className="badges my-10 flex flex-row justify-around">
                <button className="btn btn-wide text-4xl h-20" onClick={() => { setQuery("") }}>All</button>
                <button className="btn btn-wide text-4xl h-20" onClick={findTopRated}>Top Rated </button>
                <button className="btn btn-wide text-4xl h-20" onClick={findLowrated}>Low Rated </button>
                <button className="btn btn-wide text-4xl h-20" onClick={findPopular}> Popular</button>
                <button className="btn btn-wide text-4xl h-20" onClick={findVote}>Vote </button>

            </div>

            <div className="flex  justify-around flex-wrap min-h-screen-1/2">
                {
                    displayData.map((obj) => {
                        return <MovieCard key={obj.id} obj={obj}></MovieCard>
                    })

                }
            </div>



        </div>
    )
}

export default Home