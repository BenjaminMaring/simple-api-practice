import React from "react";

export default function AppBody() {
    const [type, setType] = React.useState("people")
    const [search, setSearch] = React.useState("");
    const [page, setPage] = React.useState(1);
    const [result, setResult] = React.useState([]);

    //state for web worker
    

    //I couldnt think of a way to implement the worker, 
    //I thought I could have it render the jsx elements as the function getResultElems is doing,
    //however I ran into issues getting the worker to render them because its not a .jsx file, and vite requires it to be a jsx file.
    //I ran into other troubles trying to implement the worker outside a useEffect as it causes a memory leak. 
    //so Instead I have it calculating Eulers number using a series expansion (suggested by Chat GPT)

    React.useEffect(() => {
        const worker = new Worker('../src/dataWorker.js');
        worker.postMessage(30);
        worker.onmessage = (e) => {
            console.log(e.data);
        }
        return () => worker.terminate();
    }, [])

    React.useEffect(() => {
        const data = getData()
        Promise.any([data])
            .then(res => {
                setResult(res)
            })
    }, [type, page])

    async function getData() {
        try {
            const response = await fetch(`https://swapi.dev/api/${type}/?page=${page}`)
            const data = await response.json()
            return data.results
        } catch(e) {
            console.log(e)
            return []
        }
    }

    function changeType(e) {
        setType(e.target.value);
    }

    function updateSearch(e) {
        setSearch(e.target.value);
    }

    function updatePage(e) {
        setPage(e.target.value);
    }

    function getresultElems() {
        if (result === undefined) {
            return [];
        }
        let resultElems = [];
        switch (type) {
            case "people":
                resultElems = result.map(item => {
                    return (
                        <div key={item.name} className="appbody--result-item">{`${item.name} is a ${item.gender} and is ${item.height} cm tall. ${item.name} has ${item.hair_color} and ${item.eye_color} eyes, and was born in ${item.birth_year}`}</div>
                    )
                })
            break;
            case "films":
                resultElems = result.map(item => {
                    return (
                        <div key={item.title} className="appbody--result-item">{`${item.title} was released in ${item.release_date} directed by ${item.director} and produced by ${item.producer}.`}</div>
                    )
                })
            break;
            case "planets":
                resultElems = result.map(item => {
                    return (
                        <div key={item.name} className="appbody--result-item">{`${item.name} is a ${item.climate} planet with a population of ${item.population}. The terrain consits of ${item.terrain}.`}</div>
                     )
                })   
            break;
            case "vehicles":
                resultElems = result.map(item => {
                return (
                    <div key={item.name} className="appbody--result-item">{`${item.name} are a ${item.designation} species with ${item.average_height} cm height and and average lifespan of ${item.average_lifespan}`}</div>                  
                    )
                })  
            break;
            case "starships":
                resultElems = result.map(item => {
                return (
                    <div key={item.name} className="appbody--result-item">{`${item.name} is a ${item.model} starship wmanufactured by ${item.manufacturer}, usually costing ${item.cost_in_credits} credits.`}</div>             
                    )
                }) 
            break;
            case "species":
                resultElems = result.map(item => {
                return (
                    <div key={item.name} className="appbody--result-item">{`${item.name} are a ${item.designation} species with ${item.average_height} cm height and and average lifespan of ${item.average_lifespan}`}</div>             
                    )
                }) 
            break;
            default: 
        }
        return resultElems;
    }

    const resultElems = getresultElems();
    const regex = new RegExp(".*" + search + ".*", "i");
    const filteredItems = resultElems.filter(item => regex.test(item.props.children))

    return (
        <div className="appbody--wrapper">
            <form className="appbody--form">
            <select className="appbody--select" onChange={(e) => {
                setResult([])
                setPage(1);
                changeType(e)
            }}>
                <option value="people">People</option>
                <option value="species">Species</option>
                <option value="films">Films</option>
                <option value="planets">Planets</option>
                <option value="starships">Starships</option>
                <option value="vehicles">Vehicles</option>
            </select>
            <div>
                <label htmlFor="pageNumber" className="appbody--label">Page</label>
                <input id="pageNumber" type="number" value={page} onChange={updatePage} min="1" max="9"></input>
            </div>
            <input  className="appbody--input" placeholder="Filter by name here" value={search} onChange={updateSearch}></input>
            </form>
            <div className="appbody--results">
                {filteredItems}
            </div>
        </div>
    )
}