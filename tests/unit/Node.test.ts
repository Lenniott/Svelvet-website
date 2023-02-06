import { ResizeNode } from '$lib/resizableNodes/models/ResizeNode';
import { Node } from '$lib/nodes/models/Node';
import { v4 as uuidv4 } from 'uuid';
import {
  createStoreEmpty,
  populateSvelvetStoreFromUserInput,
  findStore,
} from '$lib/store/controllers/storeApi';
import { sanitizeUserNodesAndEdges } from '$lib/container/controllers/middleware';
import type { UserNodeType, UserEdgeType } from '$lib/store/types/types';
import { populateAnchorsStore } from '$lib/store/controllers/util';

describe('tests node', () => {
  const canvasId = uuidv4();
  const initialNodes: UserNodeType[] = [
    {
      id: '1',
      position: { x: 225, y: 10 },
      data: { label: 'Add Images!' },
      width: 100,
      height: 100,
      bgColor: 'white',
      borderColor: 'transparent',
      image: true,
      src: 'https://svelvet.io/_app/assets/Logo%201-cc7b0baf.svg',
    },
    {
      id: '2',
      position: { x: 390, y: 180 },
      data: { label: 'Mixed Anchors' },
      width: 125,
      height: 40,
      bgColor: 'white',
      textColor: 'black',
      targetPosition: 'left',
    },
    {
      id: '3',
      position: { x: 225, y: 260 },
      data: { label: 'Output Node' },
      width: 100,
      height: 40,
      bgColor: 'white',
      textColor: 'black',
    },
    {
      id: '4',
      position: { x: 25, y: 180 },
      data: { label: 'Drag me!' },
      width: 125,
      height: 40,
      bgColor: 'white',
      textColor: 'black',
      targetPosition: 'right',
    },
    {
      id: '5',
      position: { x: 390, y: 380 },
      data: { label: 'Custom Node' },
      width: 125,
      height: 40,
      bgColor: 'green',
      textColor: 'black',
      borderColor: 'transparent',
      borderRadius: 0,
    },
    {
      id: '6',
      position: { x: 47.5, y: 360 },
      data: { label: 'Custom Node' },
      width: 80,
      height: 80,
      borderColor: '#FF4121',
      borderRadius: 30,
      bgColor: 'grey',
      textColor: '#FF4121',
    },
  ];

  const initialEdges: UserEdgeType[] = [
    { id: 'e1-2', source: '1', target: '2', label: 'edge label' },
    {
      id: 'e2-3',
      source: '2',
      target: '3',
      animate: true,
      label: 'animated edges',
    },
    {
      id: 'e1-4',
      source: '1',
      target: '4',
      type: 'step',
      animate: true,
      edgeColor: '#FF4121',
    },
    {
      id: 'e2-5',
      source: '2',
      target: '5',
      label: 'colored edges',
      animate: true,
      arrow: true,
      edgeColor: '#FF4121',
      labelBgColor: '#1F2937',
      labelTextColor: '#FFE4E6',
    },
    { id: 'e2-6', source: '4', target: '6', type: 'straight' },
    {
      id: 'e2-7',
      source: '3',
      target: '6',
      type: 'smoothstep',
      label: 'colored label',
      labelBgColor: '#FF4561',
      labelTextColor: 'white',
      animate: true,
    },
  ];
  //cosnt store =  invoke createEmptyStore?
  const store = createStoreEmpty(canvasId);
  //Santize input example in svelvet.svelte
  let output = sanitizeUserNodesAndEdges(initialNodes, initialEdges);
  const userNodes = output['userNodes'];
  const userEdges = output['userEdges'];

  // set canvas related stores. you need to do this before setting node/edge related stores
  // initializing nodes/edges might read relevant options from the store.
  store.widthStore.set(600);
  store.heightStore.set(600);
  store.backgroundStore.set(false);
  store.movementStore.set(true);
  const optionsObj = { snap: false, snapTo: 30 };
  store.options.set(optionsObj);
  store.nodeCreate.set(false);

  // set node/edge related stores
  //create store from user input
  //take the output and feed it to create storeformuserinput
  populateSvelvetStoreFromUserInput(canvasId, userNodes, userEdges);

  const { nodesStore } = store;

  // console.log('NODESTORE :', nodesStore)
  // nodesStore.update((node) => {
  //   console.log('NODE:', node)
  //   for (const nodeId in node) {
  //     console.log('NODEID:', node[nodeId]);
  //   }
  // });
test('set position from movement should update position X & Y based on mouse movement', () => {

  nodesStore.update((node) => {
    for (const nodeId in node) {
      if(nodeId === '1') {
        node[nodeId].setPositionFromMovement(10, 10);
        expect(node[nodeId].positionX).toBe(235)
        expect(node[nodeId].positionY).toBe(20)
      }
      if(nodeId === '2') {
        node[nodeId].setPositionFromMovement(-10, 10);
        expect(node[nodeId].positionX).toBe(380)
        expect(node[nodeId].positionY).toBe(190)
      }
      if(nodeId === '3') {
        node[nodeId].setPositionFromMovement(-10, -10);
        expect(node[nodeId].positionX).toBe(215)
        expect(node[nodeId].positionY).toBe(250)
      }
      // when setPositionsFromMovement runs it should cascade to the anchors edges and resizenode
    }
  });
})


  //Then, call set PositionAndCascade on resizeNode and make sure the width/height of the node also changes.
  //Make sure when you call delete on the node that the resizeNode also disappears.
});