## 13. 메시징 및 통합 패턴

확장성이 시스템 배포에 관한 것이라면 통합은 시스템들을 연결하는 것이다.
12장에서는 애플리케이션을 배포하는 방법과 이를 여러 프로세스와 시스템에 분해했다.
이것이 제대로 작동하려면 배포된 모든 프로세스들이 어떤 방식으로든 통신함으로써 통합되어야 한다.

분산 애플리케이션을 통합하는 주요 기술로는 두 가지가 있다.
공유 스토리지를 중앙의 중재자(coordinator)와 정보 관리자로 사용하는 것,
메시지를 사용하여 시스템 노드들에게 데이터, 이벤트 및 명령을 전파하는 것
이렇게 있다.

메시지는 소프트웨어 시스템의 모든 계층에서 사용된다.
인터넷에서 통신하기 위해 메시지를 교환하고, 파이프를 사용하여 다른 프로세스에 정보를 보내기 위해 메시지를 사용할 수도 있다.
직접적인 함수 호출(명령 패턴)의 대안으로 애플리케이션 내에서 메시지를 사용할 수도 있으며, 장치 드라이버는 메시지를 사용하여 하드웨어와 통신할 수도 있다.
컴포넌트와 시스템 간에 정보를 교환하는 방법으로 사용되는 개별적이고 구조화된 데이터를 메시지로 볼 수 있다.
그러나 분산 아키텍처를 다룰 때 **메시징 시스템**이라는 용어는 네트워크를 통한 정보 교환을 용이하게 하는 솔루션, 패턴 및 아키텍처의 특정 부류를 설명하는데 사용된다.

이러한 유형의 시스템은 몇 가지 특징들이 이런 유형의 시스템을 특정 짓는다.
브로커(broker) 또는 피어 투 피어(peer-to-peer) 구조를 사용하거나, 요청/응답 메시지 교환 또는 단방향 통신 유형을 사용하거나, 큐를 사용하여 메시지를 보다 안정적으로 전달할 수 있다.

이 장에서 알아볼 주제는 다음과 같다.
