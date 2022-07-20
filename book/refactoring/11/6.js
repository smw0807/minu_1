//클래스
class HeatingPlan {
  get targetTemperature() {
    if (thermostat.selectedTemperature > this._max) return this._max;
    else if (thermostat.selectedTemperature < this._min) return this._min;
    else return thermostat.selectedTemperature;
  }
}
//호출자
if (thePlan.targetTemperature > thermostat.currentTemperature) setToHeat();
else if (thePlan.targetTemperature < thermostat.currentTemperature) setToCool();
else setOff();

//1 변수 추출하기
class HeatingPlan {
  get targetTemperature() {
    const selectedTemperature = thermostat.selectedTemperature;
    if (selectedTemperature > this._max) return this._max;
    else if (selectedTemperature < this._min) return this._min;
    else return selectedTemperature;
  }
}

//2 매개변수 값ㅇ르 구하는 코드를 제외한 나머지를 메서드로 추출하기
class HeatingPlan {
  get targetTemperature() {
    const selectedTemperature = thermostat.selectedTemperature;
    return this.xxNEWtargetTemperature(selectedTemperature);
  }

  xxNEWtargetTemperature(selectedTemperature) {
    if (selectedTemperature > this._max) return this._max;
    else if (selectedTemperature < this._min) return this._min;
    else return selectedTemperature;
  }
}

// 3
class HeatingPlan {
  get targetTemperature() {
    return this.xxNEWtargetTemperature(thermostat.selectedTemperature);
  }
  xxNEWtargetTemperature(selectedTemperature) {
    if (selectedTemperature > this._max) return this._max;
    else if (selectedTemperature < this._min) return this._min;
    else return selectedTemperature;
  }
}

//4
if (thePlan.xxNEWtargetTemperature(thermostat.selectedTemperature) > thermostat.currentTemperature) setToHeat();
else if (thePlan.xxNEWtargetTemperature(thermostat.selectedTemperature) < thermostat.currentTemperature) setToCool();
else setOff();

//5
if (thePlan.targetTemperature(thermostat.selectedTemperature) > thermostat.currentTemperature) setToHeat();
else if (thePlan.targetTemperature(thermostat.selectedTemperature) < thermostat.currentTemperature) setToCool();
else setOff();

class HeatingPlan {
  get targetTemperature() {
    return this.targetTemperature(thermostat.selectedTemperature);
  }
  targetTemperature(selectedTemperature) {
    if (selectedTemperature > this._max) return this._max;
    else if (selectedTemperature < this._min) return this._min;
    else return selectedTemperature;
  }
}


