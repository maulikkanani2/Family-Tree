import React, { useState, useEffect } from 'react';
import { familyTree } from './data';
import { Tree, TreeNode } from 'react-organizational-chart';
import styled from 'styled-components';
import {
  TreeNodeObj,
  InterfaceParents,
  InterfaceRelationship,
} from './Interface';
import {
  seperateAbsolute,
  makeLevels,
  makeRelationship,
  importRelationship,
  findSpouse,
} from './mainFunction';

const Male = styled.div`
  padding: 5px;
  border: 1px solid lightblue;
  border-radius: 5px;
  background-color: lightblue;
  color: grey;
  margin: 3px;
`;
const Female = styled.div`
  padding: 5px;
  border: 1px solid pink;
  border-radius: 5px;
  background-color: pink;
  margin: 3px;
  color: grey;
`;
const RootDiv = styled.div`
  padding: 30px;
  border: 1px solid grey;
  border-radius: 5px;
  margin: 30px;
  color: grey;
`;

const ParentsAndChildrens = () => {
  const [parentsState, setParents] = useState<InterfaceParents>({
    absoluteParents: [],
    famalyHerachy: [],
    completeFamily: [],
  });
  const [data, setData] = useState(false);

  const printChildren = (firstChild: TreeNodeObj[]) => {
    return firstChild.map((first: TreeNodeObj) => {
      if (first.children.length) {
        return (
          <TreeNode
            label={
              <div>
                <Male>{first.male.name} </Male>
                <Female>{first.female.name}</Female>
              </div>
            }
          >
            {printChildren(first.children)}
          </TreeNode>
        );
      } else {
        if (first.male) {
          return <TreeNode label={<Male>{first.male.name}</Male>} />;
        }
        if (first.female) {
          return <TreeNode label={<Female>{first.female.name}</Female>} />;
        }
      }
    });
  };

  useEffect(() => {
    const parents: InterfaceParents = {
      absoluteParents: [],
      famalyHerachy: [],
      completeFamily: [],
    };

    const relationShip: InterfaceRelationship[] = [];

    seperateAbsolute(familyTree, parents);

    makeLevels(familyTree, parents, findSpouse);

    makeRelationship(familyTree, parents, relationShip);

    importRelationship(parents, relationShip);
    console.log(parents);

    setParents(parents);
    setData(true);
  }, []);

  if (data) {
    return (
      <div>
        {parentsState.completeFamily.map((family: TreeNodeObj, i: number) => {
          return (
            <RootDiv>
              <h2>Family Tree {i + 1}</h2>

              <Tree
                lineWidth={'2px'}
                lineColor={'grey'}
                lineBorderRadius={'10px'}
                label={
                  <div>
                    <Male>{family.male.name} </Male>
                    <Female>{family.female.name}</Female>
                  </div>
                }
              >
                {printChildren(family.children)}
              </Tree>
            </RootDiv>
          );
        })}
      </div>
    );
  } else {
    return <div>LOADING....</div>;
  }
};

export default ParentsAndChildrens;
