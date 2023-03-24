using System;
using System.Collections;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using UnityEngine;

public class WaterMovementNScaling : MonoBehaviour
{
    private float _travelLimit = 1.3f;
    //private float _scalingFactor = 0.05f;
    private List<string[]> _waterData = new List<string[]>();
    private string prevYear = "2000";   // Just a demo
    Dictionary<string, float> avg_year_and_water = new Dictionary<string, float>();
    private float whole_average = 0.0f;

    // Start is called before the first frame update
    void Start()
    {
        string file_path = "CSVs\\Export_Energydata_Eisberg_DaellikonFeldhof_JulianFiltered.csv";
        StreamReader inp_stm = new StreamReader(file_path);

        while (!inp_stm.EndOfStream)
        {
            string inp_ln = inp_stm.ReadLine();
            _waterData.Add(inp_ln.Split(","));
        }

        inp_stm.Close();

        List<float> averages_of_water = new List<float>();
        float sum = 0;
        float counter_for_avg = 0;

        foreach (string[] line in _waterData)
        {
            string currYear = line[0].Split(" ")[0].Split("/")[2];  // we are getting only the year
            if (currYear != prevYear)
            {
                prevYear = currYear;
                if (counter_for_avg != 0)
                {
                    avg_year_and_water[currYear] = sum / counter_for_avg;
                }
                sum = 0;
                counter_for_avg = 0;
            }
            float currWater = float.Parse(line[1], CultureInfo.InvariantCulture.NumberFormat);
            sum += currWater;
            counter_for_avg++;
        }

        counter_for_avg = 0;

        foreach (var key_value in avg_year_and_water) {
            whole_average += key_value.Value;
            counter_for_avg++;
        }

        whole_average = whole_average / counter_for_avg;
    }

    // Update is called once per frame
    void Update()
    {
        Vector3 position = transform.localPosition;
        Vector3 scale = transform.localScale;

        if (scale.x < whole_average)
        {
            transform.localPosition = new Vector3(position.x, position.y + 0.0005f, position.z);
            transform.localScale = new Vector3(scale.x + 0.0002f, scale.y + 0.0002f, scale.z + 0.0002f);
        }
    }
}
