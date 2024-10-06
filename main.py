from functools import cache
import osmnx
import pickle
import dask.dataframe as dd
import os
import json

network_types = ["bike", "walk", "drive"]

crime_weights = {
    "Other Assaults": 0.5,
    "Aggravated Assault No Firearm": 0.7,
    "Aggravated Assault Firearm": 1.0,
    "Thefts": 0.7,
    "Weapon Violations": 0.4,
    "All Other Offenses": 0.2,
    "Vandalism/Criminal Mischief": 0.2,
    "Motor Vehicle Theft": 0.7,
    "Robbery No Firearm": 0.6,
    "Theft from Vehicle": 0.4,
    "Narcotic / Drug Law Violations": 0.3,
    "Fraud": 0.1,
    "Arson": 0.3,
    "Embezzlement": 0.1,
    "Burglary Non-Residential": 0.5,
    "Burglary Residential": 0.6,
    "Other Sex Offenses (Not Commercialized)": 0.9,
    "Receiving Stolen Property": 0.3,
    "Robbery Firearm": 1.0,
    "Vagrancy/Loitering": 0.1,
    "Rape": 1.0,
    "Offenses Against Family and Children": 0.8,
    "Disorderly Conduct": 0.2,
    "DRIVING UNDER THE INFLUENCE": 0.6,
    "Prostitution and Commercialized Vice": 0.3,
    "Forgery and Counterfeiting": 0.2,
    "Public Drunkenness": 0.2,
    "Homicide - Criminal": 1.0,
    "Liquor Law Violations": 0.1,
    "Gambling Violations": 0.1,
    "Homicide - Justifiable": 0.1,
    "Homicide - Gross Negligence": 0.6,
}

def normalize_score(score, min_score, max_score):
    return (score - min_score) / (max_score - min_score)

@cache
def get_city_graphs():
    graph = {}
    for index, type in enumerate(network_types):
        file_path = f"data/graphs/city_graph_{type}.pkl"

        if os.path.exists(file_path):
            with open(file_path, "rb") as file:
                graph[type] = pickle.load(file)
        else:
            graph[type] = osmnx.graph_from_place(
                "Philadelphia, Pennsylvania, USA", network_type=type
            )

            with open(file_path, "wb") as file:
                pickle.dump(graph[type], file)
    return graph

    # osmnx.plot_graph(graph[index], node_size=0, edge_linewidth=0.1, save=True, filepath=f"data/graphs/city_graph_{type}.png")

@cache
def filter_data():
    dtype_spec = {
        "point_x": "float64",
        "point_y": "float64",
        "hour": "float64",
        "psa": "object",
    }

    df = dd.read_csv("data/crime_data.csv", dtype=dtype_spec)
    df["dispatch_date"] = dd.to_datetime(df["dispatch_date"], format="%Y-%m-%d")
    df["year"] = df["dispatch_date"].dt.year
    df["month"] = df["dispatch_date"].dt.month
    df["day"] = df["dispatch_date"].dt.day

    filtered_df = df[
        (df["year"] >= 2021)
        # & (df["month"] == 9)
        # & (df["day"] == 1)
        & (df["point_x"].notnull())
        & (df["point_y"].notnull())
        & (df["text_general_code"].notnull())
    ]
    return filtered_df

@cache
def get_crime_edges(graph):
    filtered_df = filter_data()

    x_coords = filtered_df["point_x"].compute().tolist()
    y_coords = filtered_df["point_y"].compute().tolist()

    crime_results = filtered_df.compute()
    nearest_edges = osmnx.distance.nearest_edges(graph, X=x_coords, Y=y_coords)
    return zip(crime_results.iterrows(), nearest_edges)

def compute_weights(graph):
    for i in graph.edges:
        graph.edges[i]["crime_weight"] = 0

    for (index, row), (u, v, k) in get_crime_edges(graph):
        graph[u][v][k]["crime_weight"] += crime_weights[row["text_general_code"]]


    all_crime_weights = [graph.edges[i]["crime_weight"] for i in graph.edges]
    min_cw, max_cw = min(all_crime_weights), max(all_crime_weights)

    all_lengths = [graph.edges[i]["length"] for i in graph.edges]
    min_l, max_l = min(all_lengths), max(all_lengths)

    for i in graph.edges:
        # test_graph.edges[i]["crime_weight"] = normalize_score(
        #     test_graph.edges[i]["crime_weight"], min_score=min_cw, max_score=max_cw
        # )
        graph.edges[i]["total_weight"] = (
            graph.edges[i]["length"] + 150000 * graph.edges[i]["crime_weight"]
        )

def get_path(graph_type, longitude_x1, latitude_y1, longitude_x2, latitude_y2):
    graphs = get_city_graphs()
    selected_graph = graphs[graph_type]

    compute_weights(selected_graph)

    orig_node = osmnx.nearest_nodes(selected_graph, longitude_x1, latitude_y1)
    dest_node = osmnx.nearest_nodes(selected_graph, longitude_x2, latitude_y2)

    shortest_path = osmnx.shortest_path(
        selected_graph, orig_node, dest_node, weight="total_weight"
    )

    coordinates = []
    for i in shortest_path:
        coordinates.append((selected_graph.nodes[i]["x"], selected_graph.nodes[i]["y"]))
    return json.dumps(coordinates)