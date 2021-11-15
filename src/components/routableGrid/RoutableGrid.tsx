import React from "react";
import GridComponent from "../../grid/GridComponent";
import {SearchCondition} from "../../gridomizer/domain/GridData";

interface RoutableGridProps {
    gridName : string,
    linkToRoute? : string,
    searchConditions? : SearchCondition[]
}

const routableGrid = (props : RoutableGridProps) => {
    return <GridComponent gridName={props.gridName} linkToRoute={props.linkToRoute} searchConditions={props.searchConditions}/>
};

export default routableGrid;