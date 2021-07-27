// Note: This is just an empty diagram with a start event.
// It's better than using modeler.createDiagram() because it sets 'isExecutable' which is necessary to execute processes

export const emptyXml = `<?xml version="1.0" encoding="UTF-8"?>
    <bpmn:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL"
        xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI"
        xmlns:dc="http://www.omg.org/spec/DD/20100524/DC"
        id="Definitions_0o8r9mb"
        targetNamespace="http://bpmn.io/schema/bpmn">
        <bpmn:process id="Process_1wd9uqr" isExecutable="true">
          <bpmn:startEvent id="StartEvent_0cuddor" />
        </bpmn:process>
        <bpmndi:BPMNDiagram id="BPMNDiagram_1">
            <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1wd9uqr">
                <bpmndi:BPMNShape id="_BPMNShape_StartEvent_2" bpmnElement="StartEvent_0cuddor">
                    <dc:Bounds x="156" y="250" width="36" height="36" />
                </bpmndi:BPMNShape>
            </bpmndi:BPMNPlane>
        </bpmndi:BPMNDiagram>
    </bpmn:definitions>`;


