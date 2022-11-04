import {
  TreeNodeObj,
  InterfacefamilyTreeMember,
  InterfaceFamilyHirachy,
} from './Interface';

export const seperateAbsolute = (familyTree: any, parents: any) => {
  familyTree.forEach((Absolute: any) => {
    if (Absolute.parents.length === 0) {
      let truthfull: boolean[] = [];
      familyTree.forEach((middle: any) => {
        if (middle.parents.length !== 0 && middle.children.length !== 0) {
          const truth = middle.children.some((data: any) => {
            if (data === Absolute.children[0]) {
              return true;
            }
            return false;
          });

          truthfull.push(truth);
        }
      });
      const truth = truthfull.every((data) => {
        return data === false;
      });
      if (truth === true) {
        if (Absolute.gender === 'male') {
          parents.absoluteParents.push(Absolute);
        }
      }
    }
  });
};

export const makeLevels = (familyTree: any, parents: any, findSpouse: any) => {
  parents.absoluteParents.forEach(
    (familyHead: InterfacefamilyTreeMember, familyHeadIndex: any) => {
      let hirachy = familyHead.children;
      let levelSize = [familyHead.children.length];
      let ind = 0;
      let level = 0;

      const female: any = findSpouse(familyHead, familyTree);
      parents.famalyHerachy.push({
        0: [
          {
            ME: [familyHead.name, female[0].name],
            MALE: familyHead,
            FEMALE: female[0],
            PARENTS: [],
          },
        ],
      });

      for (const l of levelSize) {
        let mem = 0;

        parents.famalyHerachy[familyHeadIndex][level + 1] = [];

        for (let i = 0; i <= l - 1; i++) {
          //removing one child from all family memebers
          const all = familyTree.find((all: any) => {
            return all.id === hirachy[ind];
          });
          let parent: any;
          const perfectParents = [];

          if (all !== undefined) {
            parent = familyTree.map(
              (parent: any): InterfacefamilyTreeMember | number => {
                const check = all.parents.find((child: any) => {
                  return parent.id === child;
                });
                if (check === undefined) {
                  return 0;
                } else return check;
              }
            );

            parent = all.parents.map((child: any) => {
              const check = familyTree.find((parent: any) => {
                return parent.id === child;
              });
              if (check === undefined) {
                return 0;
              } else return check;
            });

            parent = parent.filter((e: any) => {
              return e !== 0;
            });

            if (parent[0].gender === 'male') perfectParents[0] = parent[0];
            else perfectParents[1] = parent[0];

            if (parent[1].gender === 'male') perfectParents[0] = parent[1];
            else perfectParents[1] = parent[1];
          }

          //determine that chil exist
          if (all !== undefined) {
            //determines that child is parent or not
            if (all.children.length === 0) {
              const gender = all.gender;
              parents.famalyHerachy[familyHeadIndex][level + 1].push({
                ME: [all.name],
                PARENTS: [perfectParents[0].name, perfectParents[1].name],
                PARENTSFULLDATA: perfectParents,
                [gender.toUpperCase()]: all,
              });
              if (i === l - 1) {
                levelSize.push(mem);
                level++;
              }
            }
            //if child is parent than...
            else {
              let spouse: any = findSpouse(all, familyTree);

              const partners = [];
              if (all.gender === 'male') partners[0] = all;
              else partners[1] = all;

              if (spouse[0].gender === 'male') partners[0] = spouse[0];
              else partners[1] = spouse[0];

              parents.famalyHerachy[familyHeadIndex][level + 1].push({
                ME: [partners[0].name, partners[1].name],
                MALE: partners[0],
                FEMALE: partners[1],
                PARENTS: [perfectParents[0].name, perfectParents[1].name],
                PARENTSFULLDATA: perfectParents,
              });
              hirachy = [...hirachy, ...all.children];
              mem = mem + all.children.length;
              if (i === l - 1) {
                levelSize.push(mem);
                level++;
              }
            }
          }
          ind++;
        }
      }
    }
  );
};

export const makeRelationship = (
  familyTree: any,
  parents: any,
  relationShip: any
) => {
  parents.famalyHerachy.forEach((data: any, familyindex: any) => {
    let id1 = 0;
    relationShip.push({});
    const length = Object.keys(data).length;
    for (let i = 0; i < length; i++) {
      data[`${i}`].map((member: InterfaceFamilyHirachy) => {
        const myName = member.ME.join('');
        let male: any, female: any;
        if (member.MALE) male = member.MALE;
        else male = null;
        if (member.FEMALE) female = member.FEMALE;
        else female = null;
        
        relationShip[familyindex][myName] = new TreeNodeObj(
          myName,
          id1,
          male,
          female,
    
        );

        if (member.PARENTS.length != 0) {
          const p = member.PARENTS.join('');
          if (!relationShip[familyindex][p].children) {
            relationShip[familyindex][p].children = [];
          }
          relationShip[familyindex][p].children.push(
            relationShip[familyindex][myName]
          );
        }
        id1++;
      });
    }
  });
};

export const importRelationship = (parents: any, relationShip: any) => {
  relationShip.map((data: any) => {
    const CF: TreeNodeObj[] = Object.values(data);
    if (CF.length !== 0) {
      parents.completeFamily.push(CF[0]);
    }
  });
};

export const findSpouse = (
  familyHead: InterfacefamilyTreeMember,
  familyTree: InterfacefamilyTreeMember[]
) => {
  let spouse: (InterfacefamilyTreeMember | number)[] =
    familyHead.children.map((head) => {
      const check = familyTree.find((member: InterfacefamilyTreeMember) => {
        if (member.gender !== familyHead.gender) {
          return member.children[0] === head;
        } else return false;
      });
      if (check !== undefined) {
        return check;
      } else return 0;
    });
  spouse = spouse.filter((e) => {
    return e !== 0;
  });
  return spouse;
};
